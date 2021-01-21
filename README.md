About
===============
This is a playground to learn ReactJS, NextJS, and various frontend and backend services required for developing a CMS web framework from scratch.

Technologies
==============
* ReactJS/NextJS/Espresso
  * Frontend and static content
* Python Flask/SqlAlchemy
  * Backend
* Modular architecture, providing:
  * Grouping of ReactJS components and Javascript API alongside Python backend endpoints
  * Automatic loading of detected modules with Flask Blueprints

Architecture
===============

* Core NextJS Webapp
  * Runs Espresso server providing NextJS static and dynamic content
* Authentication
  * Flask API backed user authenticatoin
  * JWT with cookie integration providing both XSS and CSRF protection
* Forums
  * Generic Forums module, allowing markdown based post formatting
* Blog
  * Markdown based blogging module
  * Image Upload, with automatic thumbnail eneration and Lightbox for user presentation
  
How to run
===============
Clone the repository
>$ git clone https://github.com/malcom2073/mikesshop.net
>
> $ cd mikesshop.net

Install NPN dependancies

> $ npm install

Run NPM: (Runs on localhost:3000)

> $ npm run dev

In another terminal, activate virtualenv:

> $ cd python
>
> $ source Scripts/activate

Run app.py (Runs on localhost:5000) you may need to install some dependancies, I don't yet have a requirements.txt

> $ python app.py

Browse to http://localhost:3000 to view the page.
