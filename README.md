About
===============
This is a playground to learn ReactJS, NextJS, and various frontend and backend services required for developing a CMS web framework from scratch. This site is viewable live at https://dev.mikesshop.net and automatically rebuilds and relaunches with each commit.

Technologies
==============
* ReactJS/NextJS
  * Frontend and SSR
* Expresso
  * Static content and routing between API and ReactJS
* Python Flask/SqlAlchemy
  * Backend
* Modular plugin based architecture, providing:
  * Grouping of ReactJS components and Javascript API alongside Python backend endpoints
  * Automatic loading of detected modules with Flask Blueprints

Architecture
===============

* Core Webapp
  * Runs Expresso server providing NextJS static and dynamic content
* Python Backend
  * Authentication
    * Flask API backed user authentication
    * JWT with cookie integration providing both XSS and CSRF protection
    * User profiles with extra information available via API endpoint
  * Modules
    * Forums
      * Generic Forums module, allowing markdown based post formatting
      * Posts require authentication and are tied to a user
   * Blog
      * Markdown based blogging module
      * Image Upload, with automatic thumbnail eneration and Lightbox for user presentation
      * Links to authentication module
  
How to run
===============
Clone the repository
> $ git clone https://github.com/malcom2073/mikesshop.net
>
> $ cd mikesshop.net

Install NPN dependancies

> $ npm install

Run NPM: (Runs on localhost:3000)

> $ npm run dev

In another terminal, activate virtualenv however you like and then install dependancies:

> $ cd mikesshop.net/python
> $ pip install -r requirements.txt

Run run.py (Runs on localhost:5000)

> $ python run.py

Browse to http://localhost:3000 to view the page.
