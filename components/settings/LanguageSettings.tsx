import React from 'react';
import SelectField from '../common/SelectField';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Language } from '../../i18n/translations';

type LanguageSettingsProps = {
   settings: SettingsType,
   updateSettings: Function,
}

const LanguageSettings = ({ settings, updateSettings }: LanguageSettingsProps) => {
   const { language, setLanguage, t } = useTranslation();

   const languageOptions = [
      { label: t.settings.language.english, value: 'en' },
      { label: t.settings.language.russian, value: 'ru' },
   ];

   const handleLanguageChange = (updatedLanguage: string[]) => {
      if (updatedLanguage[0]) {
         const newLang = updatedLanguage[0] as Language;
         setLanguage(newLang);
         updateSettings('language', newLang);
      }
   };

   return (
      <div>
         <div className='settings__content styled-scrollbar p-6 text-sm'>
            <div className="settings__section__select mb-5">
               <SelectField
                  label={t.settings.language.selectLanguage}
                  options={languageOptions}
                  selected={[settings.language || language]}
                  defaultLabel={t.settings.language.selectLanguage}
                  updateField={handleLanguageChange}
                  multiple={false}
                  rounded={'rounded'}
                  minWidth={220}
               />
            </div>
            <div className="text-sm text-gray-600 mt-4 p-4 bg-blue-50 rounded">
               <p className="mb-2">
                  {language === 'en'
                     ? 'Select your preferred language for the interface. Changes will take effect immediately.'
                     : 'Выберите предпочитаемый язык интерфейса. Изменения вступят в силу немедленно.'}
               </p>
            </div>
         </div>
      </div>
   );
};

export default LanguageSettings;
