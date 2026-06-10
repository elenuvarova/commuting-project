// Icons: SF Symbol PNGs (CSS-filter tint) + inline SVG for glyphs whose
// raster export was unreliable (chevron / checkmark / warning triangle).
const DATA = {
  'sun-max-fill': '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',
  'moon-fill': 'iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAWKADAAQAAAABAAAAWAAAAADESGoqAAAFMklEQVR4Ae2cSYgfRRTGxzVOjETEGXWMOrgNCu6KHgQHE1CDqFFDPESIxBEVQQmooB4UQVD0IG44hwRC8KYgiDnlMgcRUUQhMaIwieKWuKIZ11F/HwykaYZ/VXdXVVd31YOP6Z5+/ZavX3fX1v+hoSyZgcxAZiAzkBnIDGQGusLAYQS6HuwAn4KnQRZHDNyGnd3gvxKud2Q/WTPnkflMidQiyfcly0zDxA/n/MfB36BIaHn7Ko5nqcjAOPrvgjKZ5f196OhCZKnAwCS634MymYvtT1ewm1VhYCMwPRKKRK/JrNkzsAnVInk22yP25tPWfLgGuZ+nTZl99lM1yFV1b7N3ka6mOgnzwOZxUNZ5JF3a7DKfQO2XmuSK7HV2btLUWkran4ByVVbZvzRN6uyyfqUhuboQJ9m5Sk/rOgfkiuBj0qPOnPEwKrOgyqNgMd1/sXGI2V16Gk84IFeE/54edeaMxxaIWawiq/5PTbssJQZeZL8qkYP0l5TsJ727guz/cEzw8r4zemiFBO9F13XFHV3Bf69VRawGxgfd7nWOXdxr1kjOtoJvQdfHsKIeO70WW4I1G+xDMsGweiy4xge72DzVk91ozNpUsLrFR3qK+HxPdqMxa0PwSo/RXuTRdmdMzxJpnRaC7Tm9HlEzVfCJkDvuuRSu8Gy/VfMmgi8IEN21AXy05sJE8IUBItNLtLdiIvisAJmfgg8tDuylmAgO1RG4vZfsWiS1Ex3b1kATve/wc4RFPJ1TMVXwcYEyGsXPjYF8ReWmyZqHqhX9XlSZBwrmL/xUJaqJfnJVHJrgj7mgpsdWoNoK4+bHwBWs6n8gTGpxePmiBYIP4PPMONJvHoXpdvytuYvKFrTmbQvoxXcbJoL3V6bHzQlXYkZLBDov+upykCjRtiYmtfJSzUR9qdRZMVXwZy1n9hz+72o5Bq/ub8Z6k3atq3Mf9Jpli8bPiIRgXaiXgOuFLy1Se9D1V2y6qsSmdj4klrMPhtaPrdciIlgXSE3HR8FRoBdyN1k0rTwf588SlxbEmFpC0V8EDbprNboPklzYFNGbwHLQWZkhchdk+LShLvYbYD3QaiQfonUcj4GXgdPVTvdg0Cc5rm1rFFDjyy8AEX4uGAZVZBnK6uzoEbkVlF/2uqsvBwPF9iOU47EiB76WUA0M0uHBfdjaC/RXFa/vROaARF88CSNAzdMTgEk08ve8Scn2+GYUXVda1+2ttiXPRk+3Wcwvu9AX60v4ME7UmsYiisTvYuft4j8S336G/PXDI07lMqzlKh4a+hoeqr40rS/EFjRD346x+dtgzVYNRS03/RXElnSoeN4nd9vWV61upsYC/gROG9rY64L8Q5A3gG98B6sruAOEqppY/Dzpm9ii/ZPZ+SEhkjV1ZWyWFQlysX0TRlJoVehH9rTMthV5CK+x3MI+4tC4xtWtMFtw+mqPSdZgUeuiRSKvAx8V1KbNqJZxaWZBPzTXJiEufd9PLtGJxjamgctEQ9vSM/eO6JgtBaQpHA2EhCanqb+fiHlVKZdodyeJTN9eNE061PnqAp8OOiVjRPsmCEVSHT/q/j4LOj1bs5YE1H+vQ4DPcz4iJg3B9kI00/sUiGEkTuO5U0Atn96JJlA1G9AG0Xvwq+bXUtB7WUaGG8E7wOdjQK2Zt8CtoBer5smjskxwhpp228EB0JTwn7GhnuWdYBS0JtYj8wEjXIKvS4Bmsc9ZwGn8HQGqeh3Xm38O6GJ8C/aCPUAvrQ/AbjAPsmQGMgOZgcxAZiAz4IuB/wFxp2iNI+KtLgAAAABJRU5ErkJggg==',
  'tram-fill': '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',
  'play-fill': 'iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAOKADAAQAAAABAAAAOAAAAAAun0ppAAABvElEQVRoBe2YPU4DQQyFA6KgTEOdIMENEBVX4EZUFPSUUAFXgCIcgwOgIEGPQBQJQoLnwlK0bML82DN2GEtPs7Mz9r7PE0WrHQxatA60DrQOtA60DiztwMbSld8LR7hF2oIeoQn0CrmPbRDcQt8dzTG/gfYh13EG9124xfkX1q8ht6DTPwAZ1i0oGWeIkNEdaAhU3x43oH3mY+6ZB42BWbXXLOgq0ylr5kBTIEJyzICGmM3ZUx00x3xMbjXQGJMSe4uDSphOqcGge3jRUI0Uc5I56qCSZnNqqYHmmNLIFQfVMClRUwxUwoxmDQK9gsZQUmiak6w9A90JtBlLKWmiRK2LRcCQj05kylvswvATmY4+TkpyEDvscR1P8Blw9PbzSZDrdoIvYDpmOAIMiRJ/DLnPoG+059AwBKi7J/fhmvn0M7yERl3TMXNNg6m1RcC4CakmNPJEwSwBqoBZAFQFqwlYBKwGYFGwkoBVwEoAVgXTBDQBpgFoCkwS0CSYBKBpsBxAF2AM+I6L0PdKBhtzsofxPgDQJRg3/xAX9Emu7xRdgzEgjQfQHfQGfUAP0Ck0glq0DrQOtA783w78AJCI7DSlKFIwAAAAAElFTkSuQmCC',
};
const FILTER = {
  white:   'brightness(0) invert(1)',
  muted:   'brightness(0) invert(1) opacity(0.55)',
  primary: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(193deg)',
  warning: 'brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(5deg)',
  success: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(100deg)',
  accent:  'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(230deg)',
};

// Inline-SVG icons — exact theme colours, crisp at any size, no fragile raster.
const SVG_COLOR = {
  white: '#fff', muted: 'rgba(236,239,244,0.55)', primary: 'var(--primary)',
  warning: 'var(--warning)', success: 'var(--success)', accent: 'var(--accent)', danger: 'var(--danger)',
};
const SVG = {
  'chevron-right': (s, c) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'checkmark-circle-fill': (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={c} />
      <path d="M6.8 12.3l3.3 3.3L17.2 8.6" stroke="var(--on-primary)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'exclamationmark-triangle-fill': (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.62 3.9a1.6 1.6 0 0 1 2.76 0l8.2 14.28a1.6 1.6 0 0 1-1.38 2.4H3.8a1.6 1.6 0 0 1-1.38-2.4L10.62 3.9Z" fill={c} />
      <rect x="11.1" y="8.7" width="1.8" height="5.4" rx="0.9" fill="#241a00" />
      <circle cx="12" cy="16.7" r="1.05" fill="#241a00" />
    </svg>
  ),
};

export function Icon({ name, size, color = 'white', style, ...rest }) {
  const svg = SVG[name];
  if (svg) {
    return (
      <span style={{ display: 'inline-flex', verticalAlign: 'middle', lineHeight: 0, ...style }} {...rest}>
        {svg(size, SVG_COLOR[color] || color)}
      </span>
    );
  }
  const b64 = DATA[name];
  if (!b64) return null;
  return (
    <img
      src={`data:image/png;base64,${b64}`}
      width={size} height={size}
      alt="" aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: FILTER[color], ...style }}
      {...rest}
    />
  );
}
