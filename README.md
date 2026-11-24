# FITZAPASY – strona internetowa

Statyczna, responsywna strona sklepu i treningów FITZAPASY. Nie wymaga budowania ani
serwera aplikacyjnego. Wdrażana na Hostinger przez integrację Git (push na `main` → wdrożenie).

## Struktura

```
.htaccess                    kieruje ruch do public/ (reszta repozytorium niedostępna z sieci)
public/                      ← strona
├── index.html               strona główna
├── trening-personalny-poznan.html  podstrona pod frazę „trening personalny Poznań” (adres bez .html)
├── regulamin.html           regulamin sklepu (z formularzem odstąpienia)
├── polityka-prywatnosci.html
├── .htaccess                HTTPS i www → fitzapasy.pl, kompresja, cache, nagłówki bezpieczeństwa
├── robots.txt, sitemap.xml
├── favicon.ico, icon-192.png, apple-touch-icon.png   ikony strony (kwadratowe – wymóg Google)
└── assets/
    ├── css/main.css         style (tokeny → baza → układ → komponenty → sekcje → koszyk → RWD)
    ├── js/main.js           punkt wejścia (moduł ES)
    ├── js/modules/          slider.js (wspólny mechanizm karuzel), photo-carousel.js,
    │                        review-carousel.js, cart.js, video-autoplay.js
    ├── js/data/reviews.js   treść opinii z Google
    ├── fonts/               Inter i Oswald (WOFF2, hostowane lokalnie, licencja SIL OFL)
    ├── img/                 zdjęcia WebP + og-image.jpg (podgląd przy udostępnianiu linku)
    └── video/               filmy MP4
docker/, compose.yaml        lokalne środowisko testowe (Apache z obsługą .htaccess)
.gitignore, .gitattributes   pliki pomijane w repozytorium, końce linii i pliki binarne
```

Zasady w kodzie:

- brak stylów inline w HTML – wszystko w `main.css`; kolory i wartości wspólne jako zmienne CSS w `:root`,
- JavaScript podzielony na moduły o jednej odpowiedzialności, uruchamiany przez `data-*` atrybuty
  (klasy CSS służą tylko do wyglądu),
- zdjęcia z `width`/`height` i `loading="lazy"` (poza pierwszym zdjęciem w hero),
- filmy z `preload="none"` – pobierają się dopiero, gdy pojawią się na ekranie.

## Podgląd lokalny (Docker)

```bash
docker compose up -d --build   # http://localhost:8080
docker compose logs -f         # logi serwera
docker compose down            # zatrzymanie
```

Kontener to Apache czytający pliki `.htaccess` – tak jak LiteSpeed na Hostingerze. Repozytorium
jest podmontowane jako `public_html`, czyli dokładnie w takim układzie, w jakim wdraża je
Hostinger → Git. Zmiany widać po odświeżeniu strony (bez przebudowy obrazu).

Przekierowania na `https://fitzapasy.pl` działają tylko dla tej domeny, więc lokalnie
się nie uruchamiają. Sprawdzisz je tak:

```bash
curl -sI -H 'Host: www.fitzapasy.pl' http://localhost:8080/ | grep -i location
```

Bez Dockera: `cd public && python3 -m http.server 8000` (bez reguł z `.htaccess`, więc adres
`/trening-personalny-poznan` trzeba wtedy otworzyć z końcówką `.html`).
Samo otwarcie `index.html` z dysku (`file://`) nie zadziała – przeglądarki blokują wtedy moduły JS.

## Typowe zmiany

| Co zmienić | Gdzie |
|---|---|
| Ceny treningów | sekcja `#cennik` w `index.html` **i** w `trening-personalny-poznan.html` (oraz `offers` w danych strukturalnych podstrony) |
| Ceny, opisy gum, nazwy w koszyku | `index.html`, sekcja `#sklep` (`data-name`, `data-price`, `.price`) |
| Opinie | `assets/js/data/reviews.js` |
| Numer WhatsApp i treść wiadomości z zamówieniem | `WHATSAPP_NUMBER` i `orderMessage()` w `assets/js/modules/cart.js` |
| Regulamin, polityka prywatności | `regulamin.html`, `polityka-prywatnosci.html` – żółte pola `[…]` trzeba uzupełnić |
| Kolory marki | zmienne w `:root` na początku `main.css` |
| Nowe zdjęcie | WebP do `assets/img/`, nowa nazwa pliku (unikniesz starej wersji z cache) |

## Wdrożenie na Hostinger (Git)

Hostinger klonuje całe repozytorium do `public_html`. Plik `.htaccess` w katalogu głównym
kieruje wszystkie żądania do `public/`, więc adres strony to `https://fitzapasy.pl/`
(bez `/public`), a pliki takie jak README czy `docker/` nie są dostępne z sieci.

### Pierwsza konfiguracja

1. Wypchnij repozytorium na GitHub: `git push -u origin main`.
2. hPanel → **Strony** → fitzapasy.pl → **Zaawansowane → GIT**.
3. Katalog `public_html` musi być pusty – usuń z niego domyślne pliki Hostingera
   (np. `default.php`) w Menedżerze plików.
4. Repozytorium prywatne: skopiuj z hPanelu klucz SSH i dodaj go w GitHub →
   repozytorium → **Settings → Deploy keys** (wystarczy dostęp tylko do odczytu).
5. W hPanelu podaj:
   - repozytorium: `git@github.com:pawroz/fitzapasy.git`
   - gałąź: `main`
   - katalog: zostaw puste (wdrożenie do `public_html`)
6. Kliknij **Utwórz**, a potem **Wdróż**.

### Automatyczne wdrożenie po każdym pushu

W hPanelu → GIT włącz **Automatyczne wdrażanie** i skopiuj adres webhooka. W GitHub →
repozytorium → **Settings → Webhooks → Add webhook** wklej ten adres jako *Payload URL*
(zdarzenie: *Just the push event*). Od tej chwili każdy `git push` na `main` aktualizuje stronę.

### Bez Gita (awaryjnie)

Menedżer plików lub FTP: wgraj **zawartość** katalogu `public/` bezpośrednio do `public_html`
(razem z ukrytym plikiem `public/.htaccess`). Reguły w `public/.htaccess` działają w obu układach.
Nie mieszaj obu metod – przed przejściem na Git opróżnij `public_html`.

### Przed pierwszym wdrożeniem

- Uzupełnij wszystkie żółte pola `[…]` w `regulamin.html` i `polityka-prywatnosci.html`
  (dane firmy, adres zwrotów, sposoby dostawy, terminy, data obowiązywania).
- W hPanelu podłącz domenę `fitzapasy.pl` i włącz certyfikat SSL.

### Po wdrożeniu

- Otwórz stronę na telefonie i komputerze, sprawdź koszyk, karuzele i filmy.
- Sprawdź, czy `http://fitzapasy.pl` i `www.fitzapasy.pl` przekierowują na `https://fitzapasy.pl`.
- Zgłoś `https://fitzapasy.pl/sitemap.xml` w Google Search Console.
- Jeśli coś nie ładuje się po zmianie `.htaccess`, sprawdź konsolę przeglądarki –
  nagłówek `Content-Security-Policy` blokuje skrypty i style spoza domeny.
