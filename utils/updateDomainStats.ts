import Keyword from '../database/models/keyword';
import Domain from '../database/models/domain';

/**
 * Updates domain statistics (avgPosition and mapPackKeywords) based on current keyword data
 * @param {string} domainName - The domain to update stats for
 * @returns {Promise<void>}
 */
export const updateDomainStats = async (domainName: string): Promise<void> => {
   try {
      // Get all keywords for the domain
      const allKeywords = await Keyword.findAll({ 
         where: { domain: domainName }
      });

      // Calculate stats from keywords
      const stats = allKeywords.reduce(
         (acc, keyword) => {
            const keywordData = keyword.get({ plain: true });
            
            // Count mapPack keywords
            if (keywordData.mapPackTop3 === true) {
               acc.mapPackKeywords++;
            }
            
            // Sum positions for average (exclude position 0)
            if (typeof keywordData.position === 'number' && 
                Number.isFinite(keywordData.position) && 
                keywordData.position > 0) {
               acc.totalPosition += keywordData.position;
               acc.positionCount++;
            }
            
            return acc;
         },
         { mapPackKeywords: 0, totalPosition: 0, positionCount: 0 }
      );

      // Calculate average position
      const avgPosition = stats.positionCount > 0 
         ? Math.round(stats.totalPosition / stats.positionCount) 
         : 0;

      // Update domain record
      await Domain.update(
         {
            avgPosition,
            mapPackKeywords: stats.mapPackKeywords
         },
         { where: { domain: domainName } }
      );

      console.log(`[DOMAIN STATS] Updated ${domainName}: avgPosition=${avgPosition}, mapPack=${stats.mapPackKeywords}`);
   } catch (error) {
      console.error(`[ERROR] Failed to update domain stats for ${domainName}:`, error);
   }
};