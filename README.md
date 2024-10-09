# Anonymous Microblog

The idea behind this project is creating a microblog that allows users to post anonymously.

Sometimes you would like to create a community-managed microblog to post some things that you would not want to share under your own identity. At the same time, it should not become a dumpster of random thoughts, so it should have some limitation about who can post.

Also, if the microblog becomes valuable, it should be easy to follow and interact with the content.
That is why the blog is a **community managed** Nostr account. Who is the community is pretty loosely defined - the community grows by sharing the password.

Since everyone who knows the password has the private key (with some minimal effort), there is no
hierarchy. If you share the password with "wrong" people who want to take the microblog in a 
different direction, they will succeed.

This project aims to create network entities that have their own identity, style, ... By sharing
the password with the right people, you form the identity. Note that since the password is used
to derive the private key, it cannot be changed.

## How to use?

### Generate new identity

Under keygen/ directory:

```
npm install
node deriveKeys.js password # optionally you can add different salt, but write it down somewhere!
```

This will give you hex, nsec and npub. Save these, including the salt and number of iterations.

### Configure the identity

Now that you have the private key, you need to configure the identity. It is a Nostr nsec, so
use your favourite [Nostr client](https://github.com/aljazceru/awesome-nostr) to set your name,
description, etc., configure relays, etc. Just like you would do with any Nostr identity.

### Configure the webposter

Under webposter/ directory:

First edit index.html to change the title and description, localize to your own language.

Then edit index.js to set at least the npub, and if you have changed the defaults, adjust salt and number of iterations. Optionally adjust the relays.

Then:
```
npm install
npm run build
```

Under dist/ you will have index.html and main.js. You can now deploy this to your webserver of choice. Or through Nostr.

### Deployment of webposter

Webposter is the page with JavaScript that generates the key from the password and allows users to
post. We need to deploy it somehow so it is accessible to the users.

#### Webposter through nsite / npub.hu

You can do this using [nsite](https://github.com/lez/nsite).

Clone, do pip install, then:

```
python3 uploadr.py --sec 'HEREGOESTHEHEXPRIVATEKEY' ~/anonmicroblog/webposter/dist
```

(where ~/anonmicroblog/webposter/dist is the path to your dist folder).

You will have a new website at yournpub.nostr.hu/ and that will serve as the web poster.

### Web deployment with a webserver

Simply copy the dist folder somewhere to a path on your webserver, and point your browser to
it. It is a static HTML, so no need for any backend framework. It will generate the key from the
password and communicate directly with the relays.

### Webpage for viewing the posts

Then we somehow need the users to be able to view the posts (and we should link together these
two). Again, you have several options.

#### Using npub.pro

[npub.pro](https://npub.pro/) will allow you to display the microblog on your npub.pro domain.
Just use the generated identity, pick a theme and you are good to go.

You can link the webposter from npub.pro in Settings. It will then appear in the menu.

#### Using oracolo

Another option is [oracolo](https://github.com/dtonon/oracolo?tab=readme-ov-file), which
should work pretty well with the webposter, deployed the same way. You should enable displaying
short notes in oracolo, otherwise it would just stuck on loading.

#### Using included webview

The included webview is a simple HTML page that will load the posts from the server and display
them. It has pages by calendar year and does not even show dates (personal preference, the microblog
is not much about dates anyway).

It has a bit of an old-school hacker feel

## Why this way?

The posts are not controlled by anyone special, everyone has the same rights. The content lives
on Nostr relays. It is anonymous (anyone who knows the password could have posted it), but not
everyone can post it. It can be used over the web for people who are not yet purple-pilled (just
use the npub.pro frontend and webposter). But it is a first-class Nostr citizen - can be followed,
zapped, quoted, replied to, ...

Use it to comment on the events in your area, political opinions, just general shitposting.

## How "secure" it is

Not very. If the password leaks, there's no way to change it. The content might change. That means
that the community members need to be extra careful. I consider this a feature and an experiment.
There are many ways how to make it better, but not having control feels like a good thing.

If you use the webposter, the relays will see the poster's IP address, so it is not hardcore 
protection of anonymity. Please don't abuse this and consider it a social experiment, not security
software. All posts are of course public on Nostr.

## Feedback

I'm [nostr:nprofile1qyd8wumn8ghj7mn0wd68ytn6v43x2er9v5hxxmr0w4jz7qgawaehxw309ahx7um5wghxy6t5vdhkjmn9wgh8xmmrd9skctcprpmhxue69uhhyetvv9ujuurvv438xarj9e3k7mf0qyv8wumn8ghj7un9d3shjtnrw4e8yetwwshxv7tf9uq3wamnwvaz7tmjv4kxz7fwdehhxarj9e3xzmny9uq3wamnwvaz7tmjwdekccte9ehx7um5wghx6mm99uq3jamnwvaz7tmhv4kxxmmdv5hxummnw3ezuamfdejj7qg6waehxw309ac8junpd45kgtnxd9shg6npvchxxmmd9uq3kamnwvaz7tmjv4kxz7fwdehhxarjwpkx2cnn9e3k7mf0qyfhwumn8ghj7ur4wfcxcetsv9njuetn9uqzpk4kccr9csumnwhmpv83ladqc6p88089cx2e5s2c4448ppgl2pakqe9hrl](https://njump.me/nprofile1qyd8wumn8ghj7mn0wd68ytn6v43x2er9v5hxxmr0w4jz7qgawaehxw309ahx7um5wghxy6t5vdhkjmn9wgh8xmmrd9skctcprpmhxue69uhhyetvv9ujuurvv438xarj9e3k7mf0qyv8wumn8ghj7un9d3shjtnrw4e8yetwwshxv7tf9uq3wamnwvaz7tmjv4kxz7fwdehhxarj9e3xzmny9uq3wamnwvaz7tmjwdekccte9ehx7um5wghx6mm99uq3jamnwvaz7tmhv4kxxmmdv5hxummnw3ezuamfdejj7qg6waehxw309ac8junpd45kgtnxd9shg6npvchxxmmd9uq3kamnwvaz7tmjv4kxz7fwdehhxarjwpkx2cnn9e3k7mf0qyfhwumn8ghj7ur4wfcxcetsv9njuetn9uqzpk4kccr9csumnwhmpv83ladqc6p88089cx2e5s2c4448ppgl2pakqe9hrl) on Nostr. Tag me, post about this, I'm looking forward to the experiments you'll create with this.

Zaps and support appreciated, as are pull requests.
