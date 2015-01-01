Velociratchet Meteor Package
============================

## Ratchet UI + VelocityJS page transitions

Velociratchet is a Meteor mobile app prototyping tool built on Ratchet, Velocity, Momentum, and Iron Router. 

##### Page transitions

The default page transition is `fade`.

For right-to-left page transitions, add either the `.icon-right-nav` or `.navigate-right` class from the Ratchet UI.

For left-to-right page transitions, add either the `.icon-left-nav` or `.navigate-left` class from the Ratchet UI.

##### Layout Template

Wrap the Iron Router's `yield` helper with the `momentum` helper:
```
{{#momentum plugin='iron-router' options=transition}}
  {{>yield}}
{{/momentum}}
```

For UI elements that should not be animated during page transitions, like Ratchet's footer menu, you can add extra template below the `yield` helper:
```
{{#momentum plugin='iron-router' options=transition}}
  {{>yield}}
  {{>myFooterTemplateName}}
{{/momentum}}
```

##### Template Events & Helpers

To hook up Velociratchet's helpers and events to your Meteor app, add following code to your layout template:
```
Template.myLayoutTemplateName.events(Velociratchet.events);
Template.myLayoutTemplateName.helpers(Velociratchet.helpers);
```

##### Previous Page Helper

To create a back button or link use the Iron Router `pathFor` helper with `getPreviousPage`. Example:
```
<a href="{{pathFor getPreviousPage}}">Back</a>
```

##### Dynamically adding Ratchet UI's `active` class to links

To add an `active` class to a UI element, use the `isActive` helper with 2 parameters:
* menu is the name of the route for the page being linked to
* active is the name of the current route - you can use the `getCurrentRoute` helper here

Here's an example with the footer nav from Ratchet's UI:
```
<nav id="footer" class="bar bar-tab">
    <a href="{{pathFor 'home'}}" class="tab-item {{isActive menu='home' active=getCurrentRoute}}">
        <span class="icon icon-home"></span>
        <span class="tab-label">Home</span>
    </a>
    <a href="{{pathFor 'profile'}}" class="tab-item {{isActive menu='profile' active=getCurrentRoute}}">
        <span class="icon icon-person"></span>
        <span class="tab-label">Profile</span>
    </a>
    <a href="{{pathFor 'settings'}}" class="tab-item {{isActive menu='settings' active=getCurrentRoute}}">
        <span class="icon icon-gear"></span>
        <span class="tab-label">Settings</span>
    </a>
</nav>
```
