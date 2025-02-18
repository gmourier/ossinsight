import Grid, {GridProps} from "@mui/material/Grid";
import Card, {CardProps} from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import AspectRatio from "react-aspect-ratio";
import React, {HTMLAttributeAnchorTarget, useCallback, useState} from 'react';
import Button, {ButtonProps} from '@mui/material/Button';
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ButtonBase from '@mui/material/ButtonBase';
import Link from "@docusaurus/Link";

export interface StandardCardProps extends Omit<GridProps<any, any>, 'item' | 'container'> {
  title: React.ReactNode
  description?: React.ReactNode
  codeStyleDescription?: boolean
  image?: React.ReactElement
  aspectRatio?: number
  buttonText?: string
  buttonVariant?: ButtonProps['variant']
  readMore?: string
  elevation?: number
  cardSx?: CardProps['sx']
  tags?: string[]
  link?: string
  top?: React.ReactNode
  size?: 'small'
}

function withClickable(children: React.ReactNode, {
  link,
  cardSx,
  elevation: propsElevation,
  size
}: Pick<StandardCardProps, 'link' | 'cardSx' | 'elevation' | 'size'>) {
  const [elevation, setElevation] = useState(propsElevation ?? 3)

  const onMouseEnter = useCallback(() => {
    setElevation((propsElevation ?? 3) * 2)
  }, [])

  const onMouseLeave = useCallback(() => {
    setElevation(propsElevation ?? 3)
  }, [])

  if (link) {
    return (
      <Card
        sx={{userSelect: 'none', ...cardSx}}
        elevation={elevation}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseLeave}
      >
        <ButtonBase
          component={Link}
          to={link}
          sx={{
            textAlign: 'left',
            p: size === 'small' ? 2 : 4,
            display: 'block',
            '&:hover': {
              textDecoration: 'none',
              color: 'unset',
              elevation: 4
            },
          }}>
          {children}
        </ButtonBase>
      </Card>
    )
  } else {
    return (
      <Card
        sx={{
          userSelect: 'none',
          p: size === 'small' ? 2 : 4,
          ...cardSx,
        }}
        elevation={elevation ?? 3}
      >
        {children}
      </Card>
    )
  }
}

export default function StandardCard({
  title,
  aspectRatio = 16 / 9,
  image,
  description,
  readMore,
  buttonText = 'read more',
  buttonVariant,
  codeStyleDescription = true,
  elevation,
  cardSx,
  tags,
  link,
  top,
  size,
  ...props
}: StandardCardProps) {
  const children = (
    <>
      <Typography
        variant='h3'
        sx={{
          mb: 1,
          fontWeight: 'bold',
          minHeight: 50,
          fontSize: size === 'small' ? 18 : undefined
        }}>
        {title}
      </Typography>
      {image
        ? (
          <AspectRatio ratio={aspectRatio}>
            {image}
          </AspectRatio>
        ) : undefined}
      {tags
        ? (
          <Box sx={{my: 2}}>
            {tags.map((tag, i) => <Chip size='small' label={tag} key={i} sx={{mr: 2}} />)}
          </Box>
        ) : undefined}
      {description
        ? (
          <Typography
            variant='body1'
            sx={{
              mt: 1,
              color: 'text.secondary',
              minHeight: 72,
              fontSize: size === 'small' ? 14 : undefined
            }}>
            {description}
          </Typography>
        ) : undefined}
      {readMore
        ? (
          <Button component={Link} to={readMore} size='small' variant={buttonVariant ?? 'text'} mt={2}>
            {buttonText}
          </Button>
        ) : undefined}
    </>
  )

  return (
    <Grid item {...props}>
      {top}
      {withClickable(children, {link, elevation, cardSx, size})}
    </Grid>
  )
}

