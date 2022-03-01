import React from 'react';
import { useIntl } from 'react-intl';
import { SettingsPageTitle } from '@strapi/helper-plugin';
import { HeaderLayout } from '@strapi/design-system/Layout';
import getTrad from '../../../utils/getTrad';

const EmailHeader = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <SettingsPageTitle
        name={formatMessage({
          id: getTrad('plugin.name'),
          defaultMessage: 'Magic Link',
        })}
      />
      <HeaderLayout
        id="title"
        title={formatMessage({
          id: getTrad('plugin.name'),
          defaultMessage: 'Magic Link',
        })}
        subtitle={formatMessage({
          id: getTrad('plugin.section.link'),
          defaultMessage: 'Settings'
        })}
      />
    </>
  );
};

export default EmailHeader;
