<template>
  <div>
    <aside>
      <ul class="linkList" v-for="(item, index) in links" :key="index">
        <li
          v-bind:class="{ active: index === activeItem }"
          @click="handleClick(index)"
        >
          {{ item }}
        </li>
      </ul>
    </aside>
    <main>
      <!-- <p class="read-cearfully">READ CAREFULLY</p> -->
      <h1 style="font-size: 50px; font-weight: 500; margin-bottom: 30px">
        Terms of Service
      </h1>
      <p style="margin-bottom: 30px">
        <span style="font-weight: 600; letter-spacing: 0">Last Updated: </span
        >September 01, 2021
      </p>

      <section>
        <p>
          These Terms of Service constitute a legally binding agreement made
          between you, whether personally or on behalf of an entity ("you") and
          FileEvictions ("<strong>Company</strong>", "<strong>we</strong>",
          "<strong>us</strong>", or "<strong>our</strong>"), concerning your
          access to and use of the
          <a href="https://fileevictions.com/" target="_blank"
            >https://fileevictions.com/</a
          >
          website as well as any other media form, media channel, mobile website
          or mobile application related, linked, or otherwise connected thereto
          (collectively, the "Site"). You agree that by accessing the Site, you
          have read, understood, and agreed to be bound by all of these Terms of
          Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN
          YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST
          DISCONTINUE USE IMMEDIATELY.
        </p>
        <p>
          Supplemental terms and conditions or documents that may be posted on
          the Site from time to time are hereby expressly incorporated herein by
          reference. We reserve the right, in our sole discretion, to make
          changes or modifications to these Terms of Service at any time and for
          any reason. We will alert you about any changes by updating the "Last
          updated" date of these Terms of Service, and you waive any right to
          receive specific notice of each such change. It is your responsibility
          to periodically review these Terms of Service to stay informed of
          updates. You will be subject to, and will be deemed to have been made
          aware of and to have accepted, the changes in any revised Terms of
          Service by your continued use of the Site after the date such revised
          Terms of Service are posted.
        </p>

        <p>
          The information provided on the Site is not intended for distribution
          to or use by any person or entity in any jurisdiction or country where
          such distribution or use would be contrary to law or regulation or
          which would subject us to any registration requirement within such
          jurisdiction or country. Accordingly, those persons who choose to
          access the Site from other locations do so on their own initiative and
          are solely responsible for compliance with local laws, if and to the
          extent local laws are applicable.
        </p>
      </section>
      <section ref="1">
        <h3>Intellectual Property Rights</h3>
        <p>
          Unless otherwise indicated, the Site is our proprietary property and
          all source code, databases, functionality, software, website designs,
          audio, video, text, photographs, and graphics on the Site
          (collectively, the “Content”) and the trademarks, service marks, and
          logos contained therein (the “Marks”) are owned or controlled by us or
          licensed to us, and are protected by copyright and trademark laws and
          various other intellectual property rights and unfair competition laws
          of the United States, foreign jurisdictions, and international
          conventions. The Content and the Marks are provided on the Site “AS
          IS” for your information and personal use only. Except as expressly
          provided in these Terms of Service, no part of the Site and no Content
          or Marks may be copied, reproduced, aggregated, republished, uploaded,
          posted, publicly displayed, encoded, translated, transmitted,
          distributed, sold, licensed, or otherwise exploited for any commercial
          purpose whatsoever, without our express prior written permission.
          Provided that you are eligible to use the Site, you are granted a
          limited license to access and use the Site and to download or print a
          copy of any portion of the Content to which you have properly gained
          access solely for your personal, non-commercial use. We reserve all
          rights not expressly granted to you in and to the Site, the Content
          and the Marks.
        </p>
      </section>
      <section ref="2">
        <h3>User Representations</h3>
        <p>
          By using the Site, you represent and warrant that: (1) you have the
          legal capacity and you agree to comply with these Terms of Service;
          (2) you are not a minor in the jurisdiction in which you reside; (3)
          you will not access the Site through automated or non-human means,
          whether through a bot, script, or otherwise; (4) you will not use the
          Site for any illegal or unauthorized purpose; and (5) your use of the
          Site will not violate any applicable law or regulation. If you provide
          any information that is untrue, inaccurate, not current, or
          incomplete, we have the right to suspend or terminate your account and
          refuse any and all current or future use of the Site (or any portion
          thereof).
        </p>
      </section>
      <section ref="3">
        <h3>Prohibited Activities</h3>
        <p>
          You may not access or use the Site for any purpose other than that for
          which we make the Site available. The Site may not be used in
          connection with any commercial endeavors except those that are
          specifically endorsed or approved by us.
        </p>
        <p>As a user of the Site, you agree not to:</p>
        <ol class="paragraph">
          <li>
            use the Site or the Services in any manner that could impair,
            damage, overburden or disable the Site or the Services or interfere
            with any other party&#39;s enjoyment and use of the Site or the
            Services.
          </li>
          <li>
            use the Site or the Services in order to obtain knowledge and
            information regarding the Site or the Services to then directly or
            indirectly create or cause to be created a site or software product
            or service that performs the same or substantially the same
            functions and/or has the same or substantially the same features,
            whether for your own internal use or for use by others.
          </li>
        </ol>
        <p>
          By way of example, and not as a limitation, you agree that when using
          the Site and/or the Services and when submitting any information or
          content to the Site or via the Services, you will not:
        </p>
        <ul class="paragraph">
          <li>
            Send viruses, corrupted files, or any other similar software or
            programs that may damage the operation of the Site, the Services or
            third party systems.
          </li>
          <li>
            Use a robot, spider or other automated device, process or means to
            access the Site or the Services, or defame, abuse, harass, threaten
            or otherwise violate the legal rights (such as rights of privacy and
            publicity) of others.
          </li>
          <li>
            Send messages that contain software or other material protected by
            intellectual property laws (or by rights of privacy or publicity)
            unless you own or control the rights thereto or have received all
            necessary authorizations.
          </li>
          <li>
            Harvest or otherwise collect information about others, including
            contact information such as e-mail addresses, for the purpose of
            building &quot;contact&quot; or &quot;lead&quot; lists.
          </li>
          <li>
            Publish, post, upload, distribute or disseminate any inappropriate,
            profane, defamatory, infringing, obscene, indecent or unlawful
            topic, name, material or information.
          </li>
          <li>
            Conduct or forward surveys, contests, pyramid schemes or chain
            letters.
          </li>
          <li>
            Falsify or delete any author attributions, legal or other proper
            notices or proprietary designations or labels of the origin or
            source of software or other material that is provided to or by you
            via the Site or the Services.
          </li>
          <li>Send false or misleading information.</li>
          <li>
            Restrict or inhibit any other user from using and enjoying the Site
            or the Services.
          </li>
        </ul>
      </section>
      <section ref="4">
        <h3>Submissions</h3>
        <p>
          You acknowledge and agree that any questions, comments, suggestions,
          ideas, feedback, or other information regarding the Site
          (“Submissions”) provided by you to us are non-confidential and shall
          become our sole property. We shall own exclusive rights, including all
          intellectual property rights, and shall be entitled to the
          unrestricted use and dissemination of these Submissions for any lawful
          purpose, commercial or otherwise, without acknowledgment or
          compensation to you. You hereby waive all moral rights to any such
          Submissions, and you hereby warrant that any such Submissions are
          original with you or that you have the right to submit such
          Submissions. You agree there shall be no recourse against us for any
          alleged or actual infringement or misappropriation of any proprietary
          right in your Submissions.
        </p>
      </section>
      <section ref="5">
        <h3>Account Registration and Site Management</h3>
        <p>
          You are required to register and create a username and password, and
          are required to review and agree to these Terms of Use as in effect at
          the time that the Services are used, by clicking the applicable box on
          the Site’s user registration page. You agree to: (a) maintain and
          promptly update your account information and payment method
          information; (b) provide accurate, truthful, current and complete
          information for your account; (c) create only one account (unless
          specifically approved by FileEvictions in writing); (d) maintain the
          security of your account by not sharing your username or password with
          others and restricting access to your account and otherwise not
          permitting third parties to access or use your account; (e) not sell,
          transfer or assign your username and password; (f) promptly notify
          FileEvictions if you discover or otherwise suspect any security
          breaches or any unauthorized use relating to your account; and (g)
          accept sole responsibility for all transactions or activities that
          occur under your username and password, whether or not you have
          authorized the activity. You shall indemnify FileEvictions with
          respect to any claims arising from or related to any use of your
          account, whether authorized or unauthorized. FileEviction reserves the
          right, exercisable as it determines in its sole and absolute
          discretion, to suspend, disable or terminate access to your Services
          user account based on suspected or actual unauthorized use or other
          violation of these Terms of Use or any of the other agreements, terms
          and conditions applicable to the Services. If you access the Services
          from outside the United States you hereby consent to the transmission
          and/or transfer of data relating to your user account and
          communications and transactions relating to the Services across all
          applicable international boundaries. After you accept this Agreement
          and your registration has been accepted by FileEvictions, you will
          receive a link by email, on activation of which your account will be
          established. You are solely responsible for any consequences arising
          out of your failure to maintain the confidentiality of your password.
          We reserve the right, but not the obligation, to: (1) monitor the Site
          for violations of these Terms of Service; (2) take appropriate legal
          action against anyone who, in our sole discretion, violates the law or
          these Terms of Service, including without limitation, reporting such
          user to law enforcement authorities; (3) in our sole discretion and
          without limitation, refuse, restrict access to, limit the availability
          of, or disable (to the extent technologically feasible) any of your
          accounts, or any portion thereof; (4) in our sole discretion and
          without limitation, notice, or liability, to remove from the Site or
          otherwise disable all files and content that are excessive in size or
          are in any way burdensome to our systems; and (5) otherwise manage the
          Site in a manner designed to protect our rights and property and to
          facilitate the proper functioning of the Site.
        </p>
      </section>
      <section ref="6">
        <h3>Registration Information; Privacy Policy.</h3>
        <p>
          You will promptly notify FileEvictions of any change in the
          information you provide on your registration form during your
          registration for the Services (including, without limitation, any
          change in your mailing address, telephone numbers or email address).
          (hereinafter: the "Registration Information.") FileEvictions' policy
          regarding the privacy and use of the Registration Information is set
          forth in FileEvictions' privacy policy, as the same may be modified
          and amended by FileEvictions from time to time (the "Privacy Policy").
          The Privacy Policy is incorporated herein by reference. The current
          version of the Privacy Policy is provided at
          <a href="https://fileevictions.com/privacy-policy" target="_blank"
            >https://fileevictions.com/privacy-policy</a
          >. When you accept this Agreement, you acknowledge that you agree to
          the terms of the Privacy Policy.
        </p>
      </section>
      <section ref="7">
        <h3>Description of Services</h3>
        <p>
          FileEvictions provides a self-help platform for Landlords and
          Attorneys for evicting tenants in certain specified jurisdictions
          (each, a &quot;Jurisdiction;&quot; collectively, the
          &quot;Jurisdictions&quot;). The platform contains pre-reviewed legal
          forms, instructions and an integrative dashboard for tracking the
          evictions process and filing pertinent documents with the court (the
          &quot;Service&quot;). FileEvictions is not a law firm, but a software
          company providing a platform for filling out forms and tracking the
          evictions process. FileEvictions does not represent or warrant the
          accuracy, or quality of the services provided. At no time is an
          attorney-client relationship created between you and FileEvictions,
          nor is any information provided by you to FileEvictions through use of
          the Service protected by the attorney-client privilege.
        </p>
        <p>
          FileEvictions provides the following specific service package during
          the Beta Trial:
        </p>
        <p>
          <strong>Eviction Filing</strong> <strong>Service</strong> for a
          software fee of <strong>$0.00.</strong> This service includes:
        </p>
        <ol class="paragraph">
          <li>
            Access to a document generator to draft the Verified Complaint,
            Landlord Verification, Tenant Summons and Landlord Case Information
            Statement. The filing will be the User&#39;s responsibility.
          </li>
          <li>
            Calculation of the required Court Fees (court fees are not included
            in the software fee).
          </li>
          <li>Instructions as to how to file the court documents.</li>
          <li>Access to the dynamic evictions dashboard.</li>
        </ol>
        <p>
          By accepting these Terms of Service you acknowledge and confirm that
          the eviction process is intricate, and it is therefore advisable to
          have an attorney oversee the process. If you choose to proceed without
          an attorney, it is important to note that you are doing so at your own
          risk. The legal information on the Site is not a substitute for legal
          advice and it may, or may not, be applicable to your specific case.
        </p>
        <p>
          YOU MUST HAVE A PDF READER TO VIEW AND PRINT DOCUMENTS FOR ALL OF THE
          ABOVE SERVICES.
        </p>
      </section>
      <section ref="8">
        <h3>Term and Termination</h3>
        <p>
          These Terms of Service shall remain in full force and effect while you
          use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF
          SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT
          NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING
          BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO
          REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION,
          WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF SERVICE OR OF ANY
          APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR
          PARTICIPATION IN THE SITE OR DELETE ANY CONTENT OR INFORMATION THAT
          YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION. If we
          terminate or suspend your account for any reason, you are prohibited
          from registering and creating a new account under your name, a fake or
          borrowed name, or the name of any third party, even if you may be
          acting on behalf of the third party. In addition to terminating or
          suspending your account, we reserve the right to take appropriate
          legal action, including without limitation pursuing civil, criminal,
          and injunctive redress.
        </p>
      </section>
      <section ref="9">
        <h3>Modifications and Interruptions</h3>
        <p>
          We reserve the right to change, modify, or remove the contents of the
          Site at any time or for any reason at our sole discretion without
          notice. However, we have no obligation to update any information on
          our Site. We also reserve the right to modify or discontinue all or
          part of the Site without notice at any time. We will not be liable to
          you or any third party for any modification, price change, suspension,
          or discontinuance of the Site. We cannot guarantee the Site will be
          available at all times. We may experience hardware, software, or other
          problems or need to perform maintenance related to the Site, resulting
          in interruptions, delays, or errors. We reserve the right to change,
          revise, update, suspend, discontinue, or otherwise modify the Site at
          any time or for any reason without notice to you. You agree that we
          have no liability whatsoever for any loss, damage, or inconvenience
          caused by your inability to access or use the Site during any downtime
          or discontinuance of the Site. Nothing in these Terms of Service will
          be construed to obligate us to maintain and support the Site or to
          supply any corrections, updates, or releases in connection therewith.
        </p>
      </section>
      <section ref="10">
        <h3>Governing Law</h3>
        <p>
          These Terms of Service and your use of the Site are governed by and
          construed in accordance with the laws of the State of New Jersey
          applicable to agreements made and to be entirely performed within the
          State of New Jersey, without regard to its conflict of law principles.
        </p>
      </section>
      <section ref="11">
        <h3>Corrections</h3>
        <p>
          There may be information on the Site that contains typographical
          errors, inaccuracies, or omissions, including descriptions, pricing,
          availability, and various other information. We reserve the right to
          correct any errors, inaccuracies, or omissions and to change or update
          the information on the Site at any time, without prior notice.
        </p>
      </section>
      <section ref="12">
        <h3>Disclaimer</h3>
        <p>
          THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE
          THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK.
          TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
          EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF,
          INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE
          ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT OF ANY
          WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR
          RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF
          CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY
          NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE,
          (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY
          AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED
          THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM
          THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY
          BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6)
          ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS
          OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT
          POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO
          NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY
          PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE
          SITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION
          FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A
          PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
          BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS
          WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY
          ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION
          WHERE APPROPRIATE.
        </p>
      </section>
      <section ref="13">
        <h3>Limitations of Liability</h3>
        <p>
          IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
          TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL,
          EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
          PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR
          USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
          SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED
          HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS
          OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER
          OF THE AMOUNT PAID, IF ANY, BY YOU TO US OR FIVE HUNDRED DOLLARS
          ($500.00). CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED
          WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE
          LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS
          MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
        </p>
      </section>
      <section ref="14">
        <h3>Indemnification</h3>
        <p>
          You agree to defend, indemnify, and hold us harmless, including our
          subsidiaries, affiliates, and all of our respective officers, agents,
          partners, and employees, from and against any loss, damage, liability,
          claim, or demand, including reasonable attorneys’ fees and expenses,
          made by any third party due to or arising out of: (1) use of the Site;
          (2) breach of these Terms of Service; (3) any breach of your
          representations and warranties set forth in these Terms of Service;
          (4) your violation of the rights of a third party, including but not
          limited to intellectual property rights; or (5) any overt harmful act
          toward any other user of the Site with whom you connected via the
          Site. Notwithstanding the foregoing, we reserve the right, at your
          expense, to assume the exclusive defense and control of any matter for
          which you are required to indemnify us, and you agree to cooperate, at
          your expense, with our defense of such claims. We will use reasonable
          efforts to notify you of any such claim, action, or proceeding which
          is subject to this indemnification upon becoming aware of it.
        </p>
      </section>
      <section ref="15">
        <h3>User Data</h3>
        <p>
          We will maintain certain data that you transmit to the Site for the
          purpose of managing the performance of the Site, as well as data
          relating to your use of the Site. Although we perform regular routine
          backups of data, you are solely responsible for all data that you
          transmit or that relates to any activity you have undertaken using the
          Site. You agree that we shall have no liability to you for any loss or
          corruption of any such data, and you hereby waive any right of action
          against us arising from any such loss or corruption of such data.
        </p>
      </section>
      <section ref="16">
        <h3>Electronic Communications, Transactions, and Signatures</h3>
        <p>
          Visiting the Site, sending us emails, and completing online forms
          constitute electronic communications. You consent to receive
          electronic communications, and you agree that all agreements, notices,
          disclosures, and other communications we provide to you
          electronically, via email and on the Site, satisfy any legal
          requirement that such communication be in writing. YOU HEREBY AGREE TO
          THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER
          RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS
          OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE. You
          hereby waive any rights or requirements under any statutes,
          regulations, rules, ordinances, or other laws in any jurisdiction
          which require an original signature or delivery or retention of
          non-electronic records, or to payments or the granting of credits by
          any means other than electronic means.
        </p>
      </section>
      <section ref="17">
        <h3>California Users and Residents</h3>
        <p>
          If any complaint with us is not satisfactorily resolved, you can
          contact the Complaint Assistance Unit of the Division of Consumer
          Services of the California Department of Consumer Affairs in writing
          at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834
          or by telephone at (800) 952-5210 or (916) 445-1254.
        </p>
      </section>
      <section ref="18">
        <h3>Miscellaneous</h3>
        <p>
          These Terms of Service and any policies or operating rules posted by
          us on the Site or in respect to the Site constitute the entire
          agreement and understanding between you and us. Our failure to
          exercise or enforce any right or provision of these Terms of Service
          shall not operate as a waiver of such right or provision. These Terms
          of Service operate to the fullest extent permissible by law. We may
          assign any or all of our rights and obligations to others at any time.
          We shall not be responsible or liable for any loss, damage, delay, or
          failure to act caused by any cause beyond our reasonable control. If
          any provision or part of a provision of these Terms of Service is
          determined to be unlawful, void, or unenforceable, that provision or
          part of the provision is deemed severable from these Terms of Service
          and does not affect the validity and enforceability of any remaining
          provisions. There is no joint venture, partnership, employment or
          agency relationship created between you and us as a result of these
          Terms of Service or use of the Site. You agree that these Terms of
          Service will not be construed against us by virtue of having drafted
          them. You hereby waive any and all defenses you may have based on the
          electronic form of these Terms of Service and the lack of signing by
          the parties hereto to execute these Terms of Service.
        </p>
      </section>
      <section ref="19">
        <h3>Severability</h3>
        <p>
          If and to the extent any provision of this Agreement or the other
          Terms of Service is held illegal, invalid, or unenforceable in whole
          or in part under applicable law, such provision or such portion
          thereof will be ineffective as to the jurisdiction in which it is
          illegal, invalid, or unenforceable to the extent of its illegality,
          invalidity, or unenforceability and will be deemed modified to the
          extent necessary to conform to applicable law so as to give the
          maximum effect to the intent of the parties. The illegality,
          invalidity, or unenforceability of such provision in that jurisdiction
          will not in any way affect the legality, validity, or enforceability
          of such provision in any other jurisdiction or of any other provision
          in any jurisdiction.
        </p>
      </section>
      <section ref="20">
        <h3>Survival</h3>
        <p>
          After this Agreement terminates, the terms of this Agreement and the
          other Terms of Service that expressly or by their nature contemplate
          performance after this Agreement terminates or expires will survive
          and continue in full force and effect. For example, protecting
          intellectual property, indemnification, payment of fees, reimbursement
          and setting forth limitations of liability each, by their nature,
          contemplate performance or observance after this Agreement terminates.
          Without limiting any other provisions of the Terms of Service, the
          termination of this Agreement for any reason will not release you or
          FileEvictions from any obligations incurred prior to termination of
          this Agreement or that thereafter may accrue in respect of any act or
          omission prior to such termination.
        </p>
      </section>
      <section ref="21">
        <h3>Force Majeure</h3>
        <p>
          FileEvictions shall be excused from failing to act or delay in acting
          if such failure or delay is caused by legal constraint, interruption
          of telephone, telefacsimile, or communication facilities; delay in
          transportation, equipment breakdown, or mechanical malfunction;
          electrical, power, or computer failure; accidents, fire, flood,
          explosion, theft, natural disaster, or other catastrophe; acts or
          failure to act by you or any third party; strikes or lockouts;
          emergency conditions; or riots, war, acts of government, or other
          circumstances which are unavoidable or beyond FileEviction's control.
        </p>
      </section>
      <section ref="22">
        <h3>Contact Us</h3>
        <p>
          In order to resolve a complaint regarding the Site or to receive
          further information regarding use of the Site, please contact us at:
        </p>
        <p>
          <strong>FileEvictions</strong> <br />
          2360 Lakewood Rd, STE 3, Suite 109
          <br />
          Toms River, New Jersey 08755
          <br />
          (732) 200-2945
          <br />
          support@fileevictions.com
        </p>
      </section>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeItem: null,
      links: [
        "Intellectual Property Rights",
        "User Representations",
        "Prohibited Activities",
        "Submissions",
        "Account Registration and Site Management",
        "Registration Information; Privacy Policy",
        "Description of Services",
        "Term and Termination",
        "Modifications and Interruptions",
        "Governing Law",
        "Corrections",
        "Disclaimer",
        "Limitations of Liability",
        "Indemnification",
        "User Data",
        "Electronic Communications, Transactions, and Signatures",
        "California Users and Residents",
        "Miscellaneous",
        "Severability",
        "Survival",
        "Force Majeure",
        "Contact Us",
      ],
    };
  },
  // created() {
  //   window.addEventListener("scroll", () => {
  //     console.log("scroll");
  //     Object.values(this.$refs).forEach((section, index) => {
  //       if (!section) return;
  //       if (section.getBoundingClientRect().top < 220) {
  //         this.activeItem = index;
  //         return;
  //       }
  //     });
  //   });
  // },
  // destroyed() {
  //   window.removeEventListener("scroll", () => {});
  // },
  methods: {
    handleClick(index) {
      this.activeItem = index;
      this.$smoothScroll({
        scrollTo: this.$refs[index + 1],
        duration: 1000,
        offset: -100,
      });
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap");
main {
  color: #003a60;
  font-family: "Open Sans", sans-serif, futura-pt;
  font-weight: 400;
  margin-left: 450px;
  margin-right: 100px;
  margin-top: 30px;
}
aside {
  display: block;
  position: fixed;
  left: 30px;
  top: 120px;
  bottom: 100px;
  width: 320px;
  max-height: calc(100vh - 45px);
  overflow-y: auto;
}
/* .read-cearfully {
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 3px;
} */
.lastUpdated {
  text-transform: uppercase;
  color: #9aabb5;
}
h3 {
  margin-top: 50px;
  margin-bottom: 15px;
  font-size: 40px;
  font-weight: 500;
}
p,
p li,
.paragraph {
  font-size: 17.5px;
  line-height: 1.8em;
  letter-spacing: 0.2px;
}
a {
  color: #4dccc4;
  text-decoration: none;
}
ul.linkList {
  list-style-type: none;
  padding: 0;
}
.linkList li {
  padding-bottom: 20px;
  padding-left: 7px;
  border-left: 3px solid white;
}
.linkList li:hover,
.linkList li.active {
  border-left: 3px solid #4dccc4;
  color: #003a609e;
}
.linkList li {
  cursor: pointer;
  color: #012e4bd1;
  font-size: 18px;
  transition: 0.4s;
  transition-property: all;
  transition-duration: 0.4s;
  transition-timing-function: ease;
  transition-delay: 0s;
}

@media (max-width: 1000px) {
  aside {
    display: none;
  }
  main {
    margin-left: 0;
  }
}
</style>
