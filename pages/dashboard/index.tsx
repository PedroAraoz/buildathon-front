import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

interface PoapPage {
    poap: Poap
}

interface Poap {
    claimed_by: string
    claimed_on: string
    name: string
    description: string
    image_url: string
    start_date: Date
    end_date: Date
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
                From {poap.claimed_on}
            </Box>
        </Box>
        <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={poap.image_url}
            alt={poap.name}
        />
    </Card>
)


const MyCollectionPage: NextPage = () => {
    const { address, isConnected } = useAccount()

    const [poaps, setPoaps] = useState<Poap[]>([]);

    const fetchData = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_URL_API}/collection?wallet=${address}`
            const res = await fetch(url, {
                method: 'GET'
            }).then(res => res.json())

            const ps: Poap[] = res.map((p: any) => ({
                claimed_by: p.claimed_by,
                claimed_on: p.claimed_on,
                name: p.drop.name,
                description: p.drop.description,
                image_url: p.drop.image_url,
                start_date: p.drop.start_date,
                end_date: p.drop.end_date,
            }))

            setPoaps(ps)
        } catch (error) {

        }

    }

    useEffect(() => {
        if (isConnected) {
            fetchData()
        }
    }, [])

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" >
                My Collection
            </Typography>
            {
                poaps.length > 0 ?
                    <Grid container spacing={3}>
                        {
                            poaps.map((poap) => (
                                <Grid item xs={12} sm={12} md={6} lg={4}>
                                    <PoapCard poap={poap} />
                                </Grid>
                            ))
                        }
                    </Grid>
                    : <p>Wander and claim some poaps!</p>
            }
        </Container>
    );
}


export default MyCollectionPage;