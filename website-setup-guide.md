# How to Build Your Personal Website from Scratch
### A Step-by-Step Guide for Non-Technical People

---

## What You'll Need
- A credit card (costs ~$15–30/month total)
- A computer with internet access
- About 2–3 hours of focused time
- Claude Code (free to start)

---

## Overview: The Three Pieces

Think of your website like a house:
- **GoDaddy** = your street address (the domain, e.g. `yourname.com`)
- **Amazon Lightsail** = the land and building (the server that actually hosts your files)
- **Claude Code** = the architect and builder (builds the actual website for you)

---

## PART 1: Buy Your Domain on GoDaddy

**What this does:** Reserves your website address so no one else can take it.

1. Go to [godaddy.com](https://www.godaddy.com)
2. In the search bar, type the domain name you want (e.g. `yourname.com`)
3. If it's available, click **Add to Cart**
   - `.com` is the most professional and recommended
4. **Skip** all the upsells (website builder, email, etc.) — you don't need them
5. Create an account and complete checkout
6. Cost: usually **$12–20/year**

> **Tip:** Keep your GoDaddy login credentials saved somewhere safe — you'll need them in Step 5.

---

## PART 2: Set Up Your Server on Amazon Lightsail

**What this does:** Rents a small computer on the internet that will serve your website 24/7.

### Step 2a: Create an AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **Create an AWS Account**
3. Follow the prompts — you'll need a credit card
4. Once logged in, search for **Lightsail** in the search bar at the top

### Step 2b: Create a Lightsail Instance (your server)
1. Inside Lightsail, click **Create instance**
2. **Select a Region:** Choose the one closest to where most of your visitors will be
   - Example: If you're in the US, choose `US East (N. Virginia)`
3. **Pick your instance image:**
   - Under "Select a blueprint," choose **OS Only → Ubuntu 22.04 LTS**
4. **Choose a plan:**
   - The **$5/month** plan is perfect for a personal website
5. **Name your instance:** Something simple like `my-website`
6. Click **Create instance**
7. Wait about 1–2 minutes. A green dot will appear when it's ready.

### Step 2c: Assign a Static IP Address
> This is important! Without this, your server's address can change and your domain will stop working.

1. In Lightsail, click **Networking** in the top menu
2. Click **Create static IP**
3. Attach it to the instance you just created
4. Click **Create**
5. **Write down the IP address** — it will look something like `54.123.45.67`

---

## PART 3: Build Your Website with Claude Code

**What this does:** Uses AI to write your website code for you — no coding experience needed.

### Step 3a: Install Claude Code
1. Go to [claude.ai/code](https://claude.ai/code) and follow the installation instructions
2. Open your Terminal (on Mac: press `Cmd + Space`, type "Terminal", press Enter)
3. Type `claude` and press Enter to start

### Step 3b: Create Your Website Files
In Claude Code, describe what you want. Be specific! For example:

> *"Create a personal website for me called [Your Name]. I'm a [your job/role]. Include a home page with a short bio, a page listing my projects/work, and a contact section with links to my LinkedIn and email. Make it look clean and professional with a simple color scheme."*

Claude Code will generate all the files you need. It will create:
- `index.html` — your main page
- `style.css` — the visual design
- Any additional pages you asked for

> **Tip:** Keep asking Claude Code to make changes until you're happy with it. "Make the font bigger," "Change the background to dark navy," etc.

---

## PART 4: Upload Your Website to the Server

**What this does:** Copies your website files from your computer to the Lightsail server.

### Step 4a: Connect to Your Server
1. In Lightsail, click on your instance name
2. Click the **Connect** tab
3. Click **Connect using SSH** — a black terminal window will open in your browser
4. You are now "inside" your server

### Step 4b: Install a Web Server (nginx)
Copy and paste these commands one at a time into that black terminal window, pressing Enter after each:

```
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

> If it asks you anything, type `Y` and press Enter.

### Step 4c: Upload Your Website Files
Go back to your computer's Terminal (not the server's) and run this command — replacing the placeholders:

```
scp -i ~/.ssh/your-key.pem /path/to/your/website/* ubuntu@YOUR.IP.ADDRESS:/var/www/html/
```

> **Not sure about the key file?** In Lightsail, go to **Account → SSH Keys** to download it. Then use that file path above.

Alternatively, ask Claude Code: *"How do I upload my website files to my Lightsail server at IP address [your IP]?"* — it will walk you through the exact command.

---

## PART 5: Connect Your GoDaddy Domain to Your Server

**What this does:** Makes `yourname.com` point to your Lightsail server's IP address.

### Step 5a: Update DNS Settings in GoDaddy
1. Log into [godaddy.com](https://www.godaddy.com)
2. Click your name in the top right → **My Products**
3. Find your domain and click **DNS** (or "Manage DNS")
4. Find the record that says **Type: A** and **Name: @**
5. Click the pencil/edit icon
6. Change the **Value** to your Lightsail static IP address (from Step 2c)
7. Set **TTL** to 600 (or leave default)
8. Click **Save**
9. Also update (or add) a **CNAME** record:
   - Type: `CNAME`
   - Name: `www`
   - Value: `@`
   - This makes `www.yourname.com` also work

### Step 5b: Wait for DNS to Propagate
- DNS changes take **15 minutes to 48 hours** to take effect worldwide
- You can check progress at [dnschecker.org](https://dnschecker.org) — enter your domain name

---

## PART 6: Add a Free SSL Certificate (HTTPS)

**What this does:** Adds the padlock icon to your site and makes it secure. Required for Google to rank your site.

1. Connect to your server again via Lightsail's SSH terminal
2. Run these commands:

```
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourname.com -d www.yourname.com
```

3. Follow the prompts — enter your email when asked
4. Choose option **2** (Redirect) when it asks about HTTP → HTTPS
5. Done! Your site is now at `https://yourname.com`

> The certificate renews automatically — you don't need to do anything again.

---

## You're Live!

Visit `https://yourname.com` in your browser — your personal website is now live on the internet!

---

## Ongoing: Making Updates to Your Site

Whenever you want to change something on your website:

1. Open Claude Code
2. Tell it what you want to change: *"Update my About section to say [new text]"* or *"Add a new project called X with this description"*
3. Claude Code will update your files
4. Re-upload using the `scp` command from Step 4c

---

## Quick Cost Summary

| Service | Cost |
|---|---|
| GoDaddy domain | ~$15/year |
| Amazon Lightsail server | $5/month (~$60/year) |
| SSL Certificate | FREE |
| Claude Code | Free tier available |
| **Total** | **~$75/year** |

---

## Troubleshooting

**My domain isn't working yet**
→ Wait up to 48 hours. Check [dnschecker.org](https://dnschecker.org) to see if DNS has updated.

**I see the nginx default page instead of my website**
→ Your files may not be in the right folder. They need to be in `/var/www/html/` on the server.

**I'm stuck on a step**
→ Open Claude Code and describe exactly where you're stuck. It will help you through it.

**I forgot my server IP address**
→ Log into Lightsail — it's listed on your instance dashboard.

---

## Helpful Links

- [Amazon Lightsail](https://lightsail.aws.amazon.com)
- [GoDaddy DNS Help](https://www.godaddy.com/help/manage-dns-records-680)
- [DNS Checker](https://dnschecker.org)
- [Claude Code](https://claude.ai/code)

---

*Guide created based on the setup used for [lynnfernando.com](https://lynnfernando.com)*
