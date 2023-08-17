'use client'

import * as React from 'react';
import Typography from '@mui/material/Typography';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, Avatar, Box, Button, Container, Grid, Snackbar } from '@mui/material';
import ferneteria from '../../assets/ferneteria.png'
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ClaimData {
  uuid: string;
  data: any;
}

interface Drop {
  description: string;
  end_date: Date;
  image_url: string;
  name: string;
  start_date: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const claimPoap = async (url: string, wallet: any, lat: number, lon: number) => {
  const body = {
    wallet,
    lat,
    lon
  }
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((res) => res.json());
}


const ClaimPage = () => {
  const { address, isConnected } = useAccount()
  const searchParams = useSearchParams()
  const router = useRouter();

  const uuid = searchParams.get('uuid')

  const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL_API}/drop/${uuid}`, fetcher);

  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [claimError, setClaimError] = React.useState(null);
  const [open, setOpen] = React.useState(false);


  React.useEffect(() => {
    console.log("calculate current location")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position: ", position)
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);


  const handleClick = async () => {
    try {
      const response = await claimPoap(`${process.env.NEXT_PUBLIC_URL_API}/drop/${uuid}/claim`, address, currentLocation.lat, currentLocation.lon);

      if (!response) {
        throw new Error(`sorry, unexpected error when trying to claim the Poap`);
      }
      if (response.detail) {
        setClaimError(response.detail)
        setOpen(true)
      } else {
        router.push(response.url)
      }
    } catch (error) {
      console.log("error trying claim poap", error)
      setClaimError(error);
      setOpen(true)
      return null;
    }
  }

  return (
    <>
      {data && !data.detail && (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} >
          <Grid container alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h3" align='center'>
              {data.name}
            </Typography>
            <Box justifyContent={'center'} alignItems={'center'} maxWidth={'1000px'} p={3} m={3}>
              <Avatar src={ferneteria.src} sx={{ width: '100%', height: '100%' }} />
            </Box>
            {isConnected ?
              <Button variant="contained" disabled={currentLocation === null} size='large' href={data.href} sx={{ m: 3 }} onClick={handleClick}>
                Claim POAP
              </Button> : <ConnectButton />
            }
          </Grid>


          {claimError && (
            <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
              <Alert severity="error" sx={{ width: '100%' }}>
                {claimError}
              </Alert>
            </Snackbar>
          )}

          {data.detail && (
            <Typography variant='h3'>data.detail</Typography>
          )}

        </Container>
      )}



    </>
  );
}


export default ClaimPage;