from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, 'frontend/home.html')

import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse

def fetch_page_structure(request):
    url = request.GET.get("url", "")

    if not url.startswith("http"):
        url = "https://" + url

    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract key elements
        headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2", "h3"])]
        buttons = [b.get_text(strip=True) for b in soup.find_all("button")]
        links = [a.get("href") for a in soup.find_all("a", href=True)]
        forms = [f.get("action") for f in soup.find_all("form")]

        layout_description = f"The webpage contains {len(headings)} headings, {len(buttons)} buttons, {len(links)} links, and {len(forms)} forms."

        return JsonResponse({
            "title": soup.title.string if soup.title else "No title available",
            "headings": headings,
            "buttons": buttons,
            "links": links,
            "forms": forms,
            "description": layout_description
        })

    except Exception as e:
        return JsonResponse({"error": str(e)})
