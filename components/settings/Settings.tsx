/// <reference path="../../types.d.ts" />

import React, { forwardRef, useEffect, useState } from 'react';
import { useFetchSettings, useUpdateSettings } from '../../services/settings';
import Icon from '../common/Icon';
import NotificationSettings from './NotificationSettings';
import ScraperSettings from './ScraperSettings';
import useOnKey from '../../hooks/useOnKey';
import IntegrationSettings from './IntegrationSettings';
import LanguageSettings from './LanguageSettings';
import { DEFAULT_BRANDING } from '../../utils/branding';
import { useBranding } from '../../hooks/useBranding';
import { useTranslation } from '../../i18n/LanguageContext';

type SettingsProps = {
   closeSettings: Function,
   settings?: SettingsType
}

type SettingsError = {
   type: string,
   msg: string
}

export const createDefaultSettings = (platformName: string): SettingsType => ({
   scraper_type: 'none',
   scrape_delay: 'none',
   scrape_retry: false,
   notification_interval: 'daily',
   notification_email: '',
   smtp_server: '',
   smtp_port: '',
   smtp_tls_servername: '',
   smtp_username: '',
   smtp_password: '',
   notification_email_from: '',
   notification_email_from_name: platformName,
   search_console: true,
   search_console_client_email: '',
   search_console_private_key: '',
   keywordsColumns: ['Best', 'History', 'Volume', 'Search Console'],
});

export const defaultSettings: SettingsType = createDefaultSettings(DEFAULT_BRANDING.platformName);

const Settings = forwardRef<HTMLDivElement, SettingsProps>(({ closeSettings }:SettingsProps, ref) => {
   const { branding } = useBranding();
   const { t } = useTranslation();
   const [currentTab, setCurrentTab] = useState<string>('scraper');
   const [settings, setSettings] = useState<SettingsType>(defaultSettings);
   const [settingsError, setSettingsError] = useState<SettingsError|null>(null);
   const { mutateAsync: updateMutateAsync, isLoading: isUpdating } = useUpdateSettings(() => console.log(''));
   const { data: appSettings, isLoading } = useFetchSettings();
   useOnKey('Escape', closeSettings);

   useEffect(() => {
      if (appSettings && appSettings.settings) {
         setSettings(appSettings.settings);
      }
   }, [appSettings]);

   useEffect(() => {
      if (!appSettings?.settings) {
         setSettings((currentSettings) => {
            if (currentSettings.notification_email_from_name === DEFAULT_BRANDING.platformName
               && branding.platformName !== DEFAULT_BRANDING.platformName) {
               return {
                  ...currentSettings,
                  notification_email_from_name: branding.platformName,
               };
            }
            return currentSettings;
         });
      }
   }, [appSettings?.settings, branding.platformName]);

   const closeOnBGClick = (e:React.SyntheticEvent) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (e.target === e.currentTarget) { closeSettings(); }
   };

   const updateSettings = (key: string, value:string|number|boolean) => {
      setSettings({ ...settings, [key]: value });
   };

   const performUpdate = async () => {
      let error: null|SettingsError = null;
      const sanitizedSettings: SettingsType = { ...settings };

      Object.entries(sanitizedSettings).forEach(([key, value]) => {
         if (typeof value === 'string') {
            (sanitizedSettings as Record<string, unknown>)[key] = value.trim();
         }
      });

      setSettings(sanitizedSettings);

      const {
         notification_interval,
         notification_email,
         notification_email_from,
         scraper_type,
         smtp_port,
         smtp_server,
         scraping_api,
      } = sanitizedSettings;
      if (notification_interval !== 'never') {
         if (!notification_email) {
            error = { type: 'no_email', msg: t.settings.notification.noEmail };
         }
         if (notification_email && (!smtp_port || !smtp_server || !notification_email_from)) {
               let type = 'no_smtp_from';
               if (!smtp_port) { type = 'no_smtp_port'; }
               if (!smtp_server) { type = 'no_smtp_server'; }
               error = { type, msg: t.settings.notification.noSMTP };
         }
      }

      if (scraper_type !== 'proxy' && scraper_type !== 'none' && !scraping_api) {
         error = { type: 'no_api_key', msg: t.settings.scraper.noApiKey };
      }

      if (error) {
         setSettingsError(error);
         setTimeout(() => { setSettingsError(null); }, 3000);
      } else {
         // Perform Update
         const previousScraperType = appSettings?.settings?.scraper_type;
         await updateMutateAsync(sanitizedSettings);
         // If Scraper is updated, refresh the page when enabling from a disabled state.
         if (previousScraperType === 'none' && scraper_type !== 'none') {
            window.location.reload();
         }
      }
   };

   const tabStyle = `inline-block px-3 py-2 rounded-md  cursor-pointer text-xs lg:text-sm lg:mr-3 lg:px-4 select-none z-10
   text-gray-600 border border-b-0 relative top-[1px] rounded-b-none`;
   const tabStyleActive = 'bg-white text-blue-600 border-slate-200';

   return (
       <div ref={ref} className="settings fixed w-full h-dvh top-0 left-0 z-[9999]" onClick={closeOnBGClick}>
            <div className="absolute w-full max-w-md bg-white customShadow top-0 right-0 h-dvh overflow-y-auto" data-loading={isLoading} >
               {isLoading && <div className='absolute flex content-center items-center h-full'><Icon type="loading" size={24} /></div>}
               <div className='settings__header px-5 py-4 text-slate-500'>
                  <h3 className=' text-black text-lg font-bold'>{t.settings.title}</h3>
                  <button
                  className=' absolute top-2 right-2 p-2 px- text-gray-400 hover:text-gray-700 transition-all hover:rotate-90'
                  onClick={() => closeSettings()}>
                     <Icon type='close' size={24} />
                  </button>
               </div>
               <div className='border border-slate-200 px-3 py-4 pb-0 border-l-0 border-r-0 bg-[#f8f9ff]'>
                  <ul>
                     <li
                     className={`${tabStyle} ${currentTab === 'scraper' ? tabStyleActive : 'border-transparent '}`}
                     onClick={() => setCurrentTab('scraper')}>
                       <Icon type='scraper' /> {t.settings.tabs.scraper}
                     </li>
                     <li
                     className={`${tabStyle} ${currentTab === 'notification' ? tabStyleActive : 'border-transparent'}`}
                     onClick={() => setCurrentTab('notification')}>
                        <Icon type='email' /> {t.settings.tabs.notification}
                     </li>
                     <li
                     className={`${tabStyle} ${currentTab === 'integrations' ? tabStyleActive : 'border-transparent'}`}
                     onClick={() => setCurrentTab('integrations')}>
                       <Icon type='integration' size={14} /> {t.settings.tabs.integrations}
                     </li>
                     <li
                     className={`${tabStyle} ${currentTab === 'language' ? tabStyleActive : 'border-transparent'}`}
                     onClick={() => setCurrentTab('language')}>
                       <Icon type='settings-alt' size={14} /> {t.settings.tabs.language}
                     </li>
                  </ul>
               </div>
               {currentTab === 'scraper' && settings && (
                  <ScraperSettings settings={settings} updateSettings={updateSettings} settingsError={settingsError} />
               )}

               {currentTab === 'notification' && settings && (
                  <NotificationSettings settings={settings} updateSettings={updateSettings} settingsError={settingsError} />
               )}
               {currentTab === 'integrations' && settings && (
                  <IntegrationSettings
                  settings={settings}
                  updateSettings={updateSettings}
                  settingsError={settingsError}
                  performUpdate={performUpdate}
                  closeSettings={closeSettings}
                   />
               )}
               {currentTab === 'language' && settings && (
                  <LanguageSettings
                  settings={settings}
                  updateSettings={updateSettings}
                   />
               )}
               <div className=' border-t-[1px] border-gray-200 p-2 px-3'>
                  <button
                  onClick={() => performUpdate()}
                  className=' py-3 px-5 w-full rounded cursor-pointer bg-blue-700 text-white font-semibold text-sm'>
                  {isUpdating && <Icon type="loading" size={14} />} {t.settings.updateSettings}
                  </button>
               </div>
            </div>
       </div>
   );
});

Settings.displayName = 'Settings';

export default Settings;
