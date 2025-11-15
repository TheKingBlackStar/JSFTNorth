# Quick Copy-Paste Prompts for AI Assistants

Use these prompts with Gemini, ChatGPT, Claude, or any AI assistant to get help with setup.

---

## Prompt 1: Ask AI to Help with Google Sheet Setup

Copy this entire text and paste into your AI assistant (Gemini, ChatGPT, etc.):

```
I'm setting up a calendar system for my church website. I need help creating a Google Sheet for the backend.

Here's what I need to do:

1. Create a Google Sheet named exactly: "JSTF Church Calendars"
2. Create 5 sheets (tabs) with these names:
   - Food
   - Transportation
   - Volunteers
   - Activities
   - Maintenance

3. Add headers to EACH sheet (row 1):
   - Column A: Date
   - Column B: Title
   - Column C: Description
   - Column D: Time
   - Column E: Location

Can you give me step-by-step instructions to do this? 

Please:
- Number each step
- Make instructions very clear
- Tell me exactly what to click
- Tell me what I should see at each step
- Include what to do if something goes wrong
```

---

## Prompt 2: Ask AI to Help Deploy Google Apps Script

Copy this entire text and paste into your AI assistant:

```
I'm setting up a backend for my church calendar website. I need to deploy a Google Apps Script.

Here's the code I need to deploy:

[PASTE THE ENTIRE CONTENTS OF GOOGLE_APPS_SCRIPT.gs HERE]

Can you give me detailed step-by-step instructions to:

1. Open the Apps Script editor in my Google Sheet (JSTF Church Calendars)
2. Replace all existing code with the code above
3. Save the script
4. Deploy it as a Web App
5. Copy the resulting URL

Please:
- Be very specific about where to click
- Tell me what each option should be set to:
  - Execute as: ???
  - Who has access: ???
- Tell me what I should see when it's deployed
- Explain what to do with the URL I get
- Include troubleshooting tips
```

---

## Prompt 3: Ask AI to Help Connect Frontend to Backend

Copy this entire text and paste into your AI assistant:

```
I've deployed my Google Apps Script and got a URL.

Now I need to connect it to my calendar frontend.

Here's what I need to do:

1. Find and edit the file: calendars.js
2. Find this line: const GAS_ENDPOINT = "";
3. Paste my Web App URL inside the quotes
4. Save and upload the file

The URL looks like: https://script.google.com/macros/s/AKfycbw.../exec

Can you give me step-by-step instructions to:
1. Locate the calendars.js file
2. Find the correct line
3. Paste the URL correctly
4. Save the file
5. Verify it's correct

Also tell me:
- What the line should look like after I paste the URL
- How to save the file
- Where to upload it
- What could go wrong and how to fix it
```

---

## Prompt 4: Ask AI to Help Test Everything

Copy this entire text and paste into your AI assistant:

```
I've set up my calendar system backend:
- Created Google Sheet: JSTF Church Calendars
- Deployed Google Apps Script
- Connected it to calendars.js

Now I need to test that everything works.

Can you give me step-by-step testing instructions to:

1. Open my calendar page in a browser
2. Open the browser Developer Tools (F12)
3. Look at the console for messages
4. Add a test event through the calendar form
5. Check if it appears in my Google Sheet
6. Verify everything is syncing

Please include:
- Exactly what to click and when
- What messages I should see in the console
- What should happen at each step
- How to tell if something went wrong
- What error messages mean and how to fix them
- Screenshots or diagrams would be helpful
```

---

## Prompt 5: Ask AI to Help Troubleshoot Issues

Copy this entire text (after adding your issue) and paste into your AI assistant:

```
I'm trying to set up my church calendar backend and I'm stuck.

Here's what I've done:
1. [Describe what you've done]
2. [Describe next step]
3. [Describe what happened]

Here's the error message I see:
[PASTE THE ERROR MESSAGE HERE]

Or here's what's not working:
[DESCRIBE WHAT'S NOT WORKING]

I also see these messages in the console:
[PASTE CONSOLE MESSAGES HERE]

Can you help me figure out:
1. What went wrong
2. Why it went wrong
3. How to fix it
4. How to prevent this issue in the future

Please be very specific and step-by-step.
```

---

## Prompt 6: Ask AI General Questions About Setup

Copy and modify this for any question:

```
I'm setting up a church calendar backend system using:
- Google Sheets (for data storage)
- Google Apps Script (for backend API)
- HTML/JavaScript (for frontend)

My question is:
[YOUR QUESTION HERE]

I'm stuck because:
[DESCRIBE YOUR SITUATION]

Can you:
1. Explain [what you want to understand]
2. Provide [what you want help with]
3. Tell me [what information you need]

I have access to these files:
- calendars.html
- calendars.css
- calendars.js
- GOOGLE_APPS_SCRIPT.gs
- [Other files if relevant]

Please explain in simple terms and give concrete examples.
```

---

## Prompt 7: Ask for Help with Full Setup (Comprehensive)

Copy this entire text and paste into your AI assistant:

```
I need step-by-step help setting up a backend-first calendar system for my church website.

PROJECT OVERVIEW:
- Frontend: HTML/CSS/JavaScript calendar page (calendars.html, calendars.css, calendars.js)
- Backend: Google Sheet with multiple tabs + Google Apps Script
- Goal: Users add events via calendar form → Events save to Google Sheet → Calendar displays them

CURRENT STATE:
- I have all the code files ready
- I have Google Sheets access
- I have Google Apps Script access
- I'm ready to deploy

WHAT I NEED:
I need a COMPLETE walkthrough for all 4 phases:

PHASE 1: Google Sheet Setup (5 minutes)
- Create sheet named: JSTF Church Calendars
- Create tabs: Food, Transportation, Volunteers, Activities, Maintenance
- Add headers to each

PHASE 2: Google Apps Script Deploy (10 minutes)
- Deploy backend code as Web App
- Get the resulting URL

PHASE 3: Connect Frontend (2 minutes)
- Add the URL to calendars.js
- Verify connection

PHASE 4: Test Everything (10 minutes)
- Add a test event
- Verify it appears in Google Sheet
- Verify calendar displays it

For each phase:
- Give step-by-step numbered instructions
- Tell me exactly what to click
- Tell me what I should see
- Include troubleshooting tips
- Include verification checklist

I'll follow your instructions and come back if I get stuck!
```

---

## Prompt 8: Ask AI for Help Sharing with Team

Copy this entire text and paste into your AI assistant:

```
I've successfully set up my church calendar backend system:
- Google Sheet: JSTF Church Calendars
- Backend: Google Apps Script (deployed)
- Frontend: calendars.html on my website

Now I want to share this with my church team.

Can you give me instructions on:

1. How to share the Google Sheet with team members
   - What permissions to give them
   - How to send them the link
   - What they can/cannot do with the sheet

2. How to share the calendar with church members
   - What link to give them
   - What they can see
   - What they can edit

3. How to train my team to use it
   - What to tell them about viewing events
   - What to tell them about adding events
   - What to tell them about editing events
   - What to tell them about using the Google Sheet directly

4. Best practices for managing events
   - Who should add events
   - How to keep data organized
   - How to handle mistakes
   - How to archive old events

Please give me clear, ready-to-share instructions I can send to my team.
```

---

## How to Use These Prompts

### For Gemini:
1. Go to [gemini.google.com](https://gemini.google.com)
2. Click "New chat"
3. Copy one of the prompts above
4. Paste into the text box
5. Send it (press Enter or click Send)
6. Gemini will give you detailed step-by-step help

### For ChatGPT:
1. Go to [chat.openai.com](https://chat.openai.com)
2. Log in or create account
3. Click "New chat"
4. Copy one of the prompts above
5. Paste into the message box
6. Send it
7. ChatGPT will help you

### For Claude:
1. Go to [claude.ai](https://claude.ai)
2. Log in or create account
3. Click "New conversation"
4. Copy one of the prompts above
5. Paste into the message box
6. Send it
7. Claude will help you

### For Any Other AI:
- Same process: open AI, new chat, paste prompt, send

---

## Tips for Getting Better Help from AI

### Good Prompt Practices:
✅ Be specific about what you want
✅ Include context (what you've already done)
✅ Paste error messages exactly
✅ Ask for step-by-step instructions
✅ Ask AI to explain when you don't understand
✅ Ask for verification checklists
✅ Ask "what could go wrong?" to prevent issues

### Examples:

**Bad:** "How do I deploy this?"
**Good:** "Can you give me step-by-step instructions to deploy this Google Apps Script code as a Web App? Tell me exactly which buttons to click and what settings to use."

**Bad:** "It's broken"
**Good:** "I tried to add an event but got this error: [ERROR MESSAGE]. Can you explain what went wrong and how to fix it?"

**Bad:** "Tell me how to set this up"
**Good:** "I have 30 minutes. Can you give me a quick checklist to set up my Google Sheet with 5 tabs and 5 headers? Number each step and tell me what I should see at each step."

---

## Follow-Up Questions to Ask AI

After getting help, you can ask:

- "Can you provide a checklist to verify this step worked?"
- "What could go wrong here and how do I prevent it?"
- "Can you explain [part I didn't understand]?"
- "What's the next step after this?"
- "If I see [error message], what does that mean?"
- "How do I know when I'm done with this phase?"
- "Can you give me a shortcut to do this faster?"
- "Is there a common mistake I should avoid?"

---

## Save These Prompts

**Suggestion:** Copy these prompts to a Google Doc or text file for future use.

That way if you need help again later, you have them ready to go!

---

**Created:** November 11, 2025  
**Version:** 1.0  
**For:** Users who want AI assistance with setup
