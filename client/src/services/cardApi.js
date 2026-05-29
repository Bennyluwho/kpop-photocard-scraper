const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function parseJson(response, fallbackMessage) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || fallbackMessage);
  }

  return response.json();
}

function buildQuery(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && String(value).trim()) {
      query.set(key, String(value).trim());
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getCards(search) {
  const query = buildQuery({ search });
  const res = await fetch(`${API_BASE_URL}/api/cards${query}`);
  return parseJson(res, "Failed to fetch cards");
}

export async function getCardFeed(search) {
  const query = buildQuery({ search });
  const res = await fetch(`${API_BASE_URL}/api/cards/feed${query}`);
  return parseJson(res, "Failed to fetch card feed");
}

export async function getCardById(id) {
  const res = await fetch(`${API_BASE_URL}/api/cards/${id}`);
  return parseJson(res, "Failed to fetch card");
}

export async function getCardListings(id) {
  const res = await fetch(`${API_BASE_URL}/api/cards/${id}/listings`);
  return parseJson(res, "Failed to fetch card listings");
}

export async function getCardSummary(id) {
  const res = await fetch(`${API_BASE_URL}/api/cards/${id}/summary`);
  return parseJson(res, "Failed to fetch card summary");
}

export async function getGroups() {
  const res = await fetch(`${API_BASE_URL}/api/cards/groups`);
  return parseJson(res, "Failed to fetch groups");
}

export async function createCardListing(listing) {
  const res = await fetch(`${API_BASE_URL}/api/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listing),
  });

  return parseJson(res, "Failed to create card listing");
}

export async function createListing(listing) {
  const res = await fetch(`${API_BASE_URL}/api/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listing),
  });

  return parseJson(res, "Failed to create listing");
}
