# Contributing to pixi

## Code of Conduct

The Code of Conduct explains the *bare minimum* behavior expectations that are required of
contributors. [Please read it before participating.](../CODE_OF_CONDUCT.md).

## Issue Contributions

You can report issues on [GitHub](https://github.com/pixijs/pixi.js/issues). Please search existing
issues before submitting a new one.

## Contributing Changes

To make changes you will need to have [nodejs](http://nodejs.org) installed. Once you are ready you
can contribute a change by following these steps:

### Step 1: Fork

Fork the project [on Github](https://github.com/pixijs/pixi.js) and checkout your copy locally.

```text
$ git clone <url-to-your-repo>
$ cd pixi.js
$ git remote add upstream https://github.com/pixijs/pixi.js.git
```

### Step 2: Branch

Create a `feature` or `bug-fix` branch and start hacking:

```text
$ git checkout -b feature/new-feature -t origin/master # or bug/fix-something
```

#### Which branch?

The default branch (`dev`) is where most contributions should be made, however there are times
when you may want to put your change on a different branch. Below is our branch breakdown:

- `master` - Make your change to the `master` branch if it is an *urgent* hotfix.
- `dev` - Make your change to `dev` if it is a *non-urgent* bugfix or a backwards-compatible feature.
- `next` - Make your change to `next` if it is a breaking change, or wild/crazy idea.

### Step 3: Test

You can test your change by using the automated tests packaged with pixi.js. You can run these tests
by running `npm test` from the command line. If you fix a bug please add a test that will catch that
bug if it ever happens again. This prevents regressions from sneaking in. Make sure you install
dependencies (`npm install`) before trying to run tests.

### Step 4: Commit

Make sure git knows your name and email address:

```text
$ git config --global user.name "J. Random User"
$ git config --global user.email "j.random.user@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why. Follow
these guidelines when writing one:

1. The first line should be 50 characters or less and contain a short description of the change.
2. Keep the second line blank.
3. Wrap all other lines at 72 columns.

A good commit log can look something like this:

```text
explaining the commit in one line

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc. etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way `git log` will show things
nicely even when it is indented.
```

The header line should be meaningful; it is what other people see when they run `git shortlog` or
`git log --oneline`.

Check the output of `git log --oneline files_that_you_changed` to find out what subsystem
(or subsystems) your changes touch.

If your patch fixes an open issue, you can add a reference to it at the end of the log. Use the
phrase `fixes #xxxx`. For example: `Fixed #1234, add some stuff`.

### Step 5: Push

```text
$ git push origin feature/new-feature # or bug/fix-something
```

Go to https://github.com/<yourusername>/pixi.js and select your feature branch. Click the
'Pull Request' button and fill out the form.

Pull requests are usually reviewed within a few days. If there are comments to address, apply
your changes in a separate commit and push that to your feature branch; it will automatically
show up in the Pull Request you opened.

<a id="developers-certificate-of-origin"></a>
## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I have the right to submit it
    under the open source license indicated in the file; or

* (b) The contribution is based upon previous work that, to the best of my knowledge, is covered
    under an appropriate open source license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part by me, under the same open source
    license (unless I am permitted to submit under a different license), as indicated in the file; or

* (c) The contribution was provided directly to me by some other person who certified (a), (b) or
    (c) and I have not modified it.

* (d) I understand and agree that this project and the contribution are public and that a record of
    the contribution (including all personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with this project or the open source
    license(s) involved.

This contribution guide is adapted from the Contribution Guide of
[Node.js](https://github.com/nodejs/node).
