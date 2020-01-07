# CSS Naming Conventions and Modularity

There are only two hard problems in Computer Science: cache invalidation and naming things — Phil Karlton.

Teams have different approaches to writing CSS selectors. Some teams use hyphen delimiters, while others prefer to use the more structured naming convention called BEM.

Generally, there are 3 problems that CSS naming conventions try to solve:

To know what a selector does, just by looking at its name
To have an idea of where a selector can be used, just by looking at it
To know the relationships between class names, just by looking at them

# Plain CSS Naming Conventions

## Using hyphen delimiters

In JavaScript, we prefer writing variables in camel case:

```js
var redBox = document.getElementById('...');
```

However, camelCase isn't well-suited to CSS, it is consistent with the CSS property names.

```css
// Correct
.some-class {
  font-weight: 10em;
}
// Wrong
.some-class {
  fontweight: 10em;
}
```

So, we should use standard CSS naming convention rather than camelCase:

```css
// Bad
.redBox {
  border: 1px solid red;
}

// Good
.red-box {
  border: 1px solid red;
}
```

In JavaScript, we prefer writing variables in camel case:

```js
var redBox = document.getElementById('...');
```

However, camelCase isn't well-suited to CSS, it is consistent with the CSS property names.

```css
// Correct
.some-class {
  font-weight: 10em;
}
// Wrong
.some-class {
  fontweight: 10em;
}
```

So, we should use standard CSS naming convention rather than camelCase:

```css
// Bad
.redBox {
  border: 1px solid red;
}

// Good
.red-box {
  border: 1px solid red;
}
```

## BEM

```css
.nav--secondary {
  ...;
}
.nav__header {
  ...;
}
```

Naming things correctly in CSS will make your code easier to read and maintain.

If you choose to use the BEM naming convention, it will become easier to see the relationship between your design components/blocks just by looking at the markup.

# SCSS
