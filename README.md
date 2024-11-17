# Post Reader

Post Reader is a Github project/repository that can be forked to deploy and host a website that aggregates user submitted hyperlinks ("posts"), for your specific topic, to Github Pages. Anyone with a GitHub account that creates a Pull Request can contribute content to the website.

It also includes an integration into an AI-driven content summariser for those instances where contributors omit certain meta content or summaries. 

The source repository (this one), includes a few example posts related to [Angular](https://angular.dev/), the framework this repository was built with. These examples can be viewed at this repository's [Github Page](https://thebeard.github.io/post-reader/).

## How to submit your Post

_Before submitting your first post, scroll down to the [Before making your first contribution](#before-making-your-first-contribution) section._

### Creating a new Post
1. Go to the <a href="https://github.com/thebeard/post-reader/blob/main/src/content/template" target="_blank">Post Template Page</a>
1. Copy the template using the **Copy raw file** button located in the File Preview toolbar 
1. Click the `+` (**Add file**) button in the **Files** sidebar on the left
1. Paste the template content

### Adding your Content

7. Optionally, insert a `Title` tag. _(A title will automatically be extracted from the original content if omitted)_
1. Insert one or more `Tags` tags, to ensure your content is categorised accordingly
1. Most importantly, insert the hyperlink into the `Link` tag using the format in the example.
1. Optionally, insert an `Image` tag. This will be used as a thumbnail on the website post feed. _(An image will automatically be extracted for use as a thumbnail, from the original content if omitted)_
1. Below the meta section (starting and ending with `---`) you are able to add a summary for your post using **Markdown** syntax. _(A summary will automatically be extracted from the original content if omitted)_

```markdown
---
[//]:# (Title: My title)
[//]:# (Tags: #my, #tags)
[//]:# (Link: https://my-example.com)
[//]:# (Image: https://www.btselem.org/sites/default/files/styles/huge/public/2024-08/wth-cover-en_0.png)
---

# My Example header

My example summary goes here. Lorem Ipsum dolor sit amet ...
```
_Example template_

> **Please note**: certain websites prevents web scrapers from reading their content. In such situations metadata defined above might not be extractable. Websites known to prevent web scraping are listed in the **Websites known to prevent Web Scraping** section.

### Submitting your Post
12. Use the **Commit** button to progress to the next step
1. If prompted, optionally add a commit message
1. From the two options presented, to commit directly or to create a Pull Request, select the **Pull Request** option
1. Finally confirm your commit to submit your post
1. A member of the approval committee will now receive your submission and approve it for display on the website

### Before making your First Contribution

<a href="https://github.com/signup" target="_blank">Create a Github Account</a> if you don't have one yet and return to this page. This step does not have to be repeated after creating your account.

## Websites known to prevent Web Scraping
1. &nbsp;

## How to use this Github Repository to create your own Hyperlink Post site

### Select your hosting and deployment method

#### Github Pages

By default, for any commits made to the `main` branch of your new repository, a deployment to Github Pages will triggered using Github Workflows.

Configure your Custom Domain to allow your website to display on your pre-registered domain of choice.

To disable Github Pages deployments, delete the file `.github/workflows/npm-publish-github-packages.yml`

#### Via Terraform

A sample set of terraform scripts can be found at the `/terraform` location. The sample terraform scripts are configured to deploy to AWS. Update and use as per your cloud provider and CI/CD framework accordingly.

See other section below as well.

#### Other

When setting up your own build and continuous integration pipelines, please note this application uses a custom npm command. Use `npm run build-with-content` to build your application.


### Fork the application

1. Go to [rapidapi.com](https://rapidapi.com) and create an account
1. Go to the [TLDRThis](https://rapidapi.com/tldrthishq-tldrthishq-default/api/tldrthis) API and subscribe to it
1. Copy your X-RapidAPI-key
1. Copy the URL found in the **Code snippets** section (with the trailing slash)
1. Fork the project to a new public repository
1. Go to the forked repo's Settings page
1. Go to **Secrets and Variables** >> **Actions**
1. To the repository secrets add the `SUMMARISEAPI` secret
1. Also add the `SUMMARISEAPIKEY` you copied at step (3)
1. Go to **Actions** >> **General** and enable Github Actions
1. Go to **Pages** and for the **Build and deployment** >> **Source** setting, select **Github Actions**
1. Ensure necessary Pull Request and Commit permissions are set up to allow for post approvals by the administrator and/or moderators
1. Change the title at the top of this markdown file (`# Post Reader`)
1. Change the two intro paragraphs at the top of this markdown file, to reflect the topic and purpose of your own website.
1. In the file located at `src/app/app.config.ts` change the site title on **line 24**
1. Remove the example posts in the `src/content` folder
1. See **Base Path Management** below
1. Submit and commit your first post

### Base Path Management

Due to this repository defaulting to Github Pages, there is a deployment step in the NPM tasks in the [package.json]('./package.json) file to include a base path in the build step. Depending on your hosting selection you will have to make one of the following changes

#### Github Pages (without custom domain)

Go to the [package.json](./package.json) file, line 13, and replace `/post-reader/` with the base path associated with your Github Pages page

#### Github Pages (with custom domain) and others

Depending on your hosting/website configuration, go to the [package.json](./package.json) file and update line 13 as required. Likely you have to remove the `--base-href` argument