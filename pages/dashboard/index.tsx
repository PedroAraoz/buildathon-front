import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import vogue from '../../assets/Vogue.webp'

interface PoapPage {
    poap: Poap
}

interface Poap {
    img: string;
    name: string;
    description: string;
}

const PoapCard = ({ poap }: PoapPage) => (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }} >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                    {poap.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                    {poap.description}
                </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                {poap.description}
            </Box>
        </Box>
        <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={poap.img}
            alt={poap.name}
        />
    </Card>
)


const MyCollectionPage: NextPage = () => {
    const poaps: Poap[] = [
        {
            img: vogue.src,
            name: 'My Poap',
            description: 'Este poap fue conseguido'
        },
        {
            img: vogue.src,
            name: 'My Poap',
            description: 'Este poap fue conseguido'
        },
        {
            img: vogue.src,
            name: 'My Poap',
            description: 'Este poap fue conseguido'
        },
        {
            img: vogue.src,
            name: 'My Poap',
            description: 'Este poap fue conseguido'
        },
        {
            img: vogue.src,
            name: 'My Poap',
            description: 'Este poap fue conseguido'
        },
    ]

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" >
                My Collection
            </Typography>
            <Grid container spacing={3}>
                {
                    poaps.map((poap) => (
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <PoapCard poap={poap} />
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    );
}


export default MyCollectionPage;