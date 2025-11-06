
import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://apis.trustedvehicles.com';
const VEHICLES_API_URL = `${API_BASE_URL}/api/marketplace/vehicles`;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const apiResponse = await fetch(`${VEHICLES_API_URL}/${id}`, {
      // Forward headers if needed, or add authentication
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure fresh data is fetched from the origin API
      cache: 'no-store',
    });

    if (!apiResponse.ok) {
      // If the external API call fails, forward the error response
      return new NextResponse(apiResponse.statusText, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    // Return the data from the external API
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
