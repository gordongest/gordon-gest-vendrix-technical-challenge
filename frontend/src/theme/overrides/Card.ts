import { Theme, alpha } from '@mui/material/styles';
// ----------------------------------------------------------------------

export default function Card(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  const boxShadow = `0 0 2px 0 ${alpha(
    isLight ? theme.palette.grey[500] : theme.palette.common.black,
    0.2
  )}, ${theme.customShadows.z12}`;

  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow,
          position: 'relative',
          // borderRadius: Number(theme.shape.borderRadius) * 2,
          borderRadius: Number(theme.shape.borderRadius),
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2', marginTop: theme.spacing(0.5) },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          // padding: theme.spacing(3),
          padding: theme.spacing(2),
          '&:last-child': {
            paddingBottom: theme.spacing(2),
          },
        },
      },
    },
  };
}
