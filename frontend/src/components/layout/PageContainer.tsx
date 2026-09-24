import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Container, { type ContainerProps } from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Link } from 'react-router';

const PageHeaderBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  borderRadius: (theme.vars ?? theme).shape.borderRadius,
}));

const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars ?? theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export interface Breadcrumb {
  title: string;
  path?: string;
}

export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export default function PageContainer({
  children,
  breadcrumbs,
  title,
  description,
  actions = null,
  ...containerProps
}: PageContainerProps) {
  return (
    <Container
      maxWidth={false}
      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      {...containerProps}
    >
      <Stack sx={{ flex: 1, my: 2 }} spacing={2}>
        <PageHeaderBar elevation={0} variant="outlined">
          {title ? (
            <Stack spacing={0.25}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              ) : null}
            </Stack>
          ) : null}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            {actions}
            <PageHeaderBreadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNextRoundedIcon fontSize="small" />}
            >
              <MuiLink
                component={Link}
                to="/"
                color="inherit"
                underline="none"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <HomeRoundedIcon fontSize="small" />
              </MuiLink>
              {breadcrumbs
                ? breadcrumbs.map((breadcrumb, index) =>
                    breadcrumb.path ? (
                      <MuiLink
                        key={index}
                        component={Link}
                        underline="hover"
                        color="inherit"
                        to={breadcrumb.path}
                      >
                        {breadcrumb.title}
                      </MuiLink>
                    ) : (
                      <Typography key={index} sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {breadcrumb.title}
                      </Typography>
                    ),
                  )
                : null}
            </PageHeaderBreadcrumbs>
          </Stack>
        </PageHeaderBar>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>
      </Stack>
    </Container>
  );
}
