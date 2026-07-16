export type GoogleReview = {
  authorName: string;
  profilePhotoUrl?: string;
  rating: number;
  relativeTimeDescription?: string;
  text: string;
};

export type GoogleReviewsData = {
  placeUrl: string;
  rating: number | null;
  totalReviews: number | null;
  reviews: GoogleReview[];
  source: "google" | "fallback";
};

const fallbackReviews: GoogleReview[] = [
  {
    authorName: "Jo Rodrigues",
    rating: 5,
    text: "Os produtos são excelentes, recomendo muito."
  },
  {
    authorName: "Henrique Hilton Ribeiro",
    rating: 5,
    text: "Excelente produto e atendimento rápido."
  },
  {
    authorName: "Charles Favaro",
    rating: 5,
    text: "Muito bom, compra tranquila e entrega acompanhada."
  },
  {
    authorName: "Marcos",
    rating: 5,
    text: "Excelente! Voltarei a comprar."
  }
];

const fallbackPlaceUrl =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0x94bc53903a9937eb:0xb78e26ae9f8c959!12e1?source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";

type GooglePlaceDetailsNewResponse = {
  googleMapsUri?: string;
  rating?: number;
  reviews?: Array<{
    authorAttribution?: {
      displayName?: string;
      photoUri?: string;
    };
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: {
      text?: string;
    };
  }>;
  userRatingCount?: number;
};

function fallbackGoogleReviews(): GoogleReviewsData {
  return {
    placeUrl: fallbackPlaceUrl,
    rating: 5,
    totalReviews: null,
    reviews: fallbackReviews,
    source: "fallback"
  };
}

export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return fallbackGoogleReviews();
  }

  try {
    const params = new URLSearchParams({
      languageCode: "pt-BR"
    });

    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?${params.toString()}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri"
      },
      next: { revalidate: 60 * 60 * 12 }
    });

    if (!response.ok) {
      return fallbackGoogleReviews();
    }

    const data = (await response.json()) as GooglePlaceDetailsNewResponse;

    if (!data.rating && !data.reviews?.length) {
      return fallbackGoogleReviews();
    }

    const reviews = (data.reviews || [])
      .filter((review) => review.text?.text)
      .slice(0, 4)
      .map((review) => ({
        authorName: review.authorAttribution?.displayName || "Cliente Google",
        profilePhotoUrl: review.authorAttribution?.photoUri,
        rating: review.rating || 5,
        relativeTimeDescription: review.relativePublishTimeDescription,
        text: review.text?.text || ""
      }));

    return {
      placeUrl: data.googleMapsUri || fallbackPlaceUrl,
      rating: data.rating ?? null,
      totalReviews: data.userRatingCount ?? null,
      reviews: reviews.length ? reviews : fallbackReviews,
      source: reviews.length ? "google" : "fallback"
    };
  } catch {
    return fallbackGoogleReviews();
  }
}
