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

type GooglePlaceDetailsResponse = {
  result?: {
    rating?: number;
    reviews?: Array<{
      author_name?: string;
      profile_photo_url?: string;
      rating?: number;
      relative_time_description?: string;
      text?: string;
    }>;
    url?: string;
    user_ratings_total?: number;
  };
  status?: string;
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

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "rating,user_ratings_total,reviews,url",
    language: "pt-BR",
    reviews_sort: "newest",
    key: apiKey
  });

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`, {
      next: { revalidate: 60 * 60 * 12 }
    });

    if (!response.ok) {
      return fallbackGoogleReviews();
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse;

    if (data.status !== "OK" || !data.result) {
      return fallbackGoogleReviews();
    }

    const reviews = (data.result.reviews || [])
      .filter((review) => review.text)
      .slice(0, 4)
      .map((review) => ({
        authorName: review.author_name || "Cliente Google",
        profilePhotoUrl: review.profile_photo_url,
        rating: review.rating || 5,
        relativeTimeDescription: review.relative_time_description,
        text: review.text || ""
      }));

    return {
      placeUrl: data.result.url || fallbackPlaceUrl,
      rating: data.result.rating ?? null,
      totalReviews: data.result.user_ratings_total ?? null,
      reviews: reviews.length ? reviews : fallbackReviews,
      source: reviews.length ? "google" : "fallback"
    };
  } catch {
    return fallbackGoogleReviews();
  }
}
