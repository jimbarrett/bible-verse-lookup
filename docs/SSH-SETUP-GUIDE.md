# SSH Key Setup for GitHub Actions

## 🔑 **Finding Your SSH Key**

Since you already created an SSH key and linked it to GitHub, you have these files:

```bash
# Check what keys you have
ls -la ~/.ssh/

# You should see files like:
# id_rsa      <- This is your PRIVATE key (use for SERVER_SSH_KEY)
# id_rsa.pub  <- This is your PUBLIC key (already added to GitHub)
```

## 📋 **GitHub Secrets Setup**

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these repository secrets:

### **SERVER_HOST**
```
Your server's IP address or hostname
Example: 123.456.789.012
Example: biblereader.online (if DNS points to your server)
```

### **SERVER_USER** 
```
Your SSH username on the server
Example: deploy
Example: barrett
```

### **SERVER_SSH_KEY**
```bash
# Copy the PRIVATE key content (NOT the .pub file)
cat ~/.ssh/id_rsa

# Copy the ENTIRE output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... all the key content ...
# -----END OPENSSH PRIVATE KEY-----
```

### **SERVER_PORT** (optional)
```
22
# Only add this if you use a non-standard SSH port
```

## 🔍 **Verify SSH Access**

Test that your key works:

```bash
# Test SSH connection to your server
ssh -p 22 deploy@your.server.ip

# Should log you in without asking for a password
```

## ⚠️ **Important Notes**

1. **Use the PRIVATE key** (id_rsa) for SERVER_SSH_KEY, NOT the public key (id_rsa.pub)
2. **Copy the entire key** including the header and footer lines
3. **Never commit the private key** to your repository
4. **The public key** should already be in `~/.ssh/authorized_keys` on your server

## 🚨 **If SSH Key Doesn't Exist**

If you don't have an SSH key, create one:

```bash
# Generate new SSH key
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# Copy public key to server
ssh-copy-id deploy@your.server.ip

# Or manually add to server:
cat ~/.ssh/id_rsa.pub
# Then paste into /home/deploy/.ssh/authorized_keys on your server
```
