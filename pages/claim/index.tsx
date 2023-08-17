'use client'

import * as React from 'react';
import Typography from '@mui/material/Typography';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation'
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { Avatar, Box, Button, Container, Grid, Skeleton } from '@mui/material';
import ferneteria from '../../assets/ferneteria.png'
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ClaimData {
  uid: string;
  data: any;
}

interface Drop {
  description: string;
  end_date: Date;
  image_url: string;
  name: string;
  start_date: Date;
}

// export const fetcher = async (url: string) => {
//   const response: any = await fetch(url);
//   console.log(response.json());
//   return response.json();
// };
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

// export const claimPoap = async (url: string) => {
//   const response: any = await fetch(url, { method: 'POST' });
//   return response;
// };


const ClaimPage = () => {
  const { address, isConnected } = useAccount()
  const searchParams = useSearchParams()
  const router = useRouter();

  const uid = searchParams.get('uid')

  console.log(uid);

  const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_URL_API}/drop/${uid}`, fetcher);
  console.log("data: ", data)

  const [currentLocation, setCurrentLocation] = React.useState(null);

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
      const response = await claimPoap(`${process.env.NEXT_PUBLIC_URL_API}/drop/${uid}/claim`, address, currentLocation.lat, currentLocation.lon);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response.detail) {
        alert(response.detail)
      } else {
        router.push(response.url)
      }
    } catch (error) {
      alert("Error inesperado")
      console.error('An error occurred:', error.message);
      return null; // or handle the error in a way that fits your use case
    }

  }

  return (
    <>
      {isLoading && <Skeleton />}
      {data && (<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} >
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
      </Container>
      )}
      {error && (
        `Error mensaje: ${error}`
      )}
    </>
  );
}


// export const getServerSideProps: GetServerSideProps<ClaimData> = async ({ params }) => {
//   try {
//     const uid = params?.uid as string;

//     // Hacer una solicitud al backend
//     // const response: any = await fetch(`URL_DEL_BACKEND/${uid}`);

//     const data = {
//       href: 'http://poap.com/12345',
//       name: 'La Ferneteria',
//       img: ferneteria.src,
//     }

//     // Retornar los datos para ser utilizados en la página
//     return {
//       props: {
//         uid,
//         data,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return {
//       props: {
//         uid: '',
//         data: null,
//       },
//     };
//   }
// };

export default ClaimPage;