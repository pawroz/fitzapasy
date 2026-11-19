# Archiwum – karuzela „Zaufali nam”

Slajdy zdjęte ze strony, zachowane na przyszłość. Katalog `archiwum/` leży poza `public/`,
więc nie jest publikowany na stronie (główny `.htaccess` kieruje cały ruch do `public/`).

## Borys Mańkowski

- Zdjęcie: `hero-borys-mankowski.webp` (820×547)
- Podpis: **Borys Mańkowski** – Były mistrz KSW w wadze półśredniej
- Tekst alternatywny: Borys Mańkowski wchodzi do klatki na gali KSW
- Kadrowanie: `object-position: center 22%`

### Jak przywrócić

1. Skopiuj zdjęcie do `public/assets/img/`.
2. W `public/assets/css/main.css`, przy pozostałych klasach `.focus-*`, dodaj:

   ```css
   .focus-22 { object-position: center 22%; }
   ```

3. W `public/index.html`, w karuzeli „Zaufali nam” (sekcja `#top`), wstaw slajd w wybranym
   miejscu i popraw numery w `aria-label` kolejnych slajdów:

   ```html
   <figure class="sl" aria-label="Zdjęcie 2">
     <img class="focus-22" src="assets/img/hero-borys-mankowski.webp" alt="Borys Mańkowski wchodzi do klatki na gali KSW" width="820" height="547" loading="lazy">
     <figcaption><b>Borys Mańkowski</b><span>Były mistrz KSW w wadze półśredniej</span></figcaption>
   </figure>
   ```

Kropki nawigacji karuzela tworzy sama na podstawie liczby slajdów.
