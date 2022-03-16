/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  getYupInnerErrors,
  CheckPagePermissions,
  LoadingIndicatorPage,
  useFocusWhenNavigate,
} from '@strapi/helper-plugin';
import { Main } from '@strapi/design-system/Main';
import { ContentLayout } from '@strapi/design-system/Layout';
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Typography } from '@strapi/design-system/Typography';
import { TextInput } from '@strapi/design-system/TextInput';
import { Button } from '@strapi/design-system/Button';
import { useNotifyAT } from '@strapi/design-system/LiveRegions';
import Check from '@strapi/icons/Check';
import schema from '../../utils/schema';
import pluginPermissions from '../../permissions';
import { fetchMagicLinkSettings, saveSecretKey } from './utils/api';
import EmailHeader from './components/EmailHeader';
import getTrad from '../../utils/getTrad';
import PropTypes from 'prop-types';

const ProtectedSettingsPage = () => (
  // <CheckPagePermissions permissions={pluginPermissions.settings}>
    <SettingsPage />
  // </CheckPagePermissions>
);

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { notifyStatus } = useNotifyAT();
  useFocusWhenNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSecretKeyValid, setIsSecretKeyValid] = useState(false);
  const [config, setConfig] = useState({
    secretKey: '',
  });
  const [secretKey, setSecretKey] = useState(config?.secretKey);

  useEffect(() => {
    setIsLoading(true);

    fetchMagicLinkSettings()
      .then(config => {
        notifyStatus(
          formatMessage({
            id: getTrad('Settings.email.plugin.notification.data.loaded'),
            defaultMessage: 'Email settings data has been loaded',
          })
        );

        setConfig(config);
        const secretKey = config?.secretKey;

        if (secretKey) {
          setSecretKey(secretKey);
        }
      })
      .finally(() => setIsLoading(false));
  }, [formatMessage, notifyStatus]);

  useEffect(() => {
    if (formErrors.secretKey) {
      const input = document.querySelector('#secret-key-input');
      input.focus();
    }
  }, [formErrors]);

  useEffect(() => {
    schema
      .validate({ secretKey: secretKey }, { abortEarly: false })
      .then(() => setIsSecretKeyValid(true))
      .catch(() => setIsSecretKeyValid(false));
  }, [secretKey]);

  const handleChange = e => {
    setSecretKey(() => e.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await schema.validate({ secretKey: secretKey }, { abortEarly: false });

      setIsSubmitting(true);

      saveSecretKey({ secretKey: secretKey })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      setFormErrors(getYupInnerErrors(error));
    }
  };

  if (isLoading) {
    return (
      <Main labelledBy="title" aria-busy="true">
        <EmailHeader />
        <ContentLayout>
          <LoadingIndicatorPage />
        </ContentLayout>
      </Main>
    );
  }

  return (
    <Main labelledBy="title" aria-busy={isSubmitting}>
      <EmailHeader />
      <ContentLayout>
        <form onSubmit={handleSubmit}>
          <Stack size={7}>
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Stack size={4}>
                <Typography>
                  {formatMessage({
                    id: getTrad('plugin.section.instructions'),
                    defaultMessage: 'Set your Magic.link secret key to authenticate your users. Users can still log in via the default Strapi authentication system unless you block registration and/or the native endpoints.',
                  })}
                </Typography>
                <Grid gap={5} alignItems="end">
                  <GridItem col={6} s={12}>
                    <TextInput
                      id="secret-key-input"
                      name="secret-key"
                      onChange={handleChange}
                      label={formatMessage({
                        id: getTrad('plugin.section.secretkey'),
                        defaultMessage: 'Secret key',
                      })}
                      value={secretKey}
                      error={
                        formErrors?.secretKey &&
                        formatMessage({
                          id: getTrad(`${formErrors?.secretKey}`),
                          defaultMessage: 'This is an invalid value',
                        })
                      }
                      placeholder={formatMessage({
                        id: 'plugin.section.secretkey',
                        defaultMessage: 'ex: sk_live_917AP2C13217D',
                      })}
                    />
                  </GridItem>
                  <GridItem col={7} s={12}>
                   <Button
                      loading={isSubmitting}
                      disabled={!isSecretKeyValid}
                      type="submit"
                      startIcon={<Check />}
                    >
                      {formatMessage({ id: getTrad('plugin.section.buttons.submit'), defaultMessage: 'Save' })}
                    </Button>
                  </GridItem>
                </Grid>
              </Stack>
            </Box>
          </Stack>
        </form>
      </ContentLayout>
    </Main>
  );
};

export default ProtectedSettingsPage;
