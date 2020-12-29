/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const POST = 'post'
const BEFORE = 'before'
const AFTER = 'after'
const nodemailer = require('nodemailer')

exports.getUser = functions.https.onCall(async (data, context) => {
    let user, final
    try {
        user = await (await admin.auth().getUser(data)).toJSON()
        final = {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
        }
    } catch(e) {
        final = ''
    }

    return final
})

exports.countCommunity = functions.database.ref('/community').onWrite(async (change, context) => {
    const count = updateNum(change, 'community-posts', '')
    return change.after.ref.parent.child('num-community').set(count);
});

exports.countGeneralBlogs = functions.database.ref(`/blog/general`).onWrite(async (change, context) => {
    const count = updateNum(change, 'blog-posts', 'general')
    return change.after.ref.parent.child('num-general').set(count);
});

exports.countEventBlogs = functions.database.ref(`/blog/events`).onWrite((change, context) => {
    const count = updateNum(change, 'blog-posts', 'events')
    return change.after.ref.parent.child('num-events').set(count);
});


exports.countPodcastBlogs = functions.database.ref(`/blog/podcasts`).onWrite((change, context) => {
    const count = updateNum(change, 'blog-posts', 'podcasts')
    return change.after.ref.parent.child('num-podcasts').set(count);
});

function removeHtmlTags(text) {
    if(text === "") {
        return "Not Provided"
    } else {
        while (text.indexOf('<') !== -1) {
            text = text.replace('<', '&lt;')
        }
        while (text.indexOf('>') !== -1) {
            text = text.replace('>', '&gt;')
        }
        return text
    }
  }

exports.sendEmail = functions.https.onCall(async (data) => {
    const { to, subject, formValue } = data
    if(!to || !subject) {
        throw Error('Incorrect Data');
    }
    let html = ''
    if(formValue.name) { // peer
        html = `
        <html>
            Name: ${removeHtmlTags(formValue.name)} <br/>
            Age: ${removeHtmlTags(formValue.age)} <br/>
            I identify as: ${removeHtmlTags(formValue.identify)} <br/>
            Preference: ${removeHtmlTags(formValue.pref)} <br/>
            Contact Method: ${removeHtmlTags(formValue.contactMethod)} <br/>
            Contact Info: ${removeHtmlTags(formValue.contactInfo)} <br/>
        </html>
        `
    } else if (formValue.fname) { // life coach
        html = `
        <html>
            First Name: ${removeHtmlTags(formValue.fname)} <br/>
            Last Name: ${removeHtmlTags(formValue.lname)} <br/>
            Email: ${removeHtmlTags(formValue.email)} <br/>
            Phone: ${removeHtmlTags(formValue.phone)} <br/>

        </html>
        `
    } else {
        throw Error("Incorrect Data")
    }

    const smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: functions.config().email.user,
          pass: functions.config().email.pass
        }
      })
      const mailOpts = {
        from: '',
        to,
        subject,
        html
      }
      smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
            throw error
        }
        else {
            return response
        }
    })
  })
  

function diff(first, second, type) {
    let difference
    let loc = ''
    let jsonFirst, jsonSecond =[]
    if(type !== POST) {
        for(let entry1 of first) {
            let jEntry1
            jEntry1 = JSON.stringify(entry1[type])
            jsonFirst.push(jEntry1)
        }
        for(let entry2 of second) {
            let jEntry2 = JSON.stringify(entry2[type])
            jsonSecond.push(jEntry2)
        }
    } else { 
        jsonFirst = first
        jsonSecond = second
    }
    if (jsonFirst.length > jsonSecond.length) {
        difference = jsonFirst.filter(x => jsonSecond.indexOf(x) === -1);
        loc = BEFORE
    } else {
        difference = jsonSecond.filter(x => jsonFirst.indexOf(x) === -1);
        loc = AFTER
    }
    
    return [difference, loc]
}

function updateNum(change, type, cat) {
    if (change) {
        const dataBefore = change.before.val()
        const dataAfter = change.after.val();
        let keysAfter = [], keysBefore = []
        if(dataBefore) {
            keysBefore = Object.keys(dataBefore)
        }
        if(dataAfter) {
            keysAfter = Object.keys(dataAfter)
        }
        const countBefore = keysBefore.length;
        const countAfter = keysAfter.length;

        if (countBefore !== countAfter) { // delete or create a post
            const [keys, loc] = diff(keysBefore, keysAfter, POST) // get the post that was added or deleted
            for (let id of keys) { // loop}
                const flip = loc === BEFORE ? AFTER : BEFORE
                const uid = change[loc].val()[id].uid || change[flip].val()[id].uid 
                if(uid) {
                    change.after.ref.root.child('users/' + uid + '/num-' + type).transaction((count) => {
                        if (loc === BEFORE) { // post was deleted
                            return count - 1
                        } else {
                            return count + 1
                        }
                    })
                }
                if(loc === BEFORE) {
                    if(uid) {
                        change.after.ref.root.child('users/' + uid + '/' + type + '/' + id).set(null)
                    }
                    if(cat) {
                        change.after.ref.root.child('blog/' + cat  + '/' + id).set(null)
                    } else {
                        change.after.ref.root.child('community/' + '/' + id).set(null)
                    }
                }
            }
        } 
        return countAfter
    }
    return 0
}