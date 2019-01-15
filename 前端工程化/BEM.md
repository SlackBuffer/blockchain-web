http://getbem.com/
![](http://getbem.com/assets/github_captions.jpg)
- Block
    - Standalone entity that is meaningful on its own
        - `header`, `container`, `menu`, `checkbox`, `input`
    - <mark>While blocks **can be nested** and interact with each other, semantically they remain equal; there is **no precedence or hierarchy**</mark>
    - Block structure should be **flattened**; you do not need to reflect nested DOM structure of the block; it makes the elements be **dependent on the block only**
- Element
    - A part of a block that has no standalone meaning an is **semantically tied to its block**
        - `menu item`, `list item`, `checkbox caption`, `header title`
- Modifier
    - A flag on a block or element. Use them to change **appearance**, **behavior** or **state**
        - `disabled`, `highlighted`, `checked`, `fixed`, `size big`, `color yellow`
    - Modifier is an **extra class** name which you add to a block/element DOM node. Add modifier classes only to blocks/elements they modify, and **keep the original class**
        - When adding/removing modifiers dynamically with JavaScript, the additional modifier is more handy. Switching it off would mean only removing one CSS class from the DOM node with no need to add the core block CSS class back as it sits there forever

```html
<button class="button">
	Normal button
</button>
<button class="button button--state-success">
	Success button
</button>
<button class="button button--state-danger">
	Danger button
</button>

<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>
```

- BEM introduces independent components
    - 2 different blocks should not affect each other
    - It is quite normal and logical that an element is affected by the block's current state. So a block modifier can affect elements

        ```CSS
        .my-block--xmas .my-block__button {}
        ```

- BEM recommends every block to reset itself
- CSS
    - Use class name selector only
    - No tag name or ids
    - No dependency on other blocks/elements on a page
- Benefits
    - Block styles are never **dependent** on other elements on a page, so you will never experience problems from cascading.
    - You also get the ability to **transfer** blocks from your finished projects to new ones
    - **Composing** independent blocks in different ways, and reusing them intelligently, reduces the amount of CSS code that you will have to maintain
    - With a set of style guidelines in place, you can build a library of blocks, making your CSS super effective