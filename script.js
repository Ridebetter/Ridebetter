/*
 * Simple client-side search logic for RideBetter.
 *
 * When a user submits their postcode or city in the search form, this
 * script checks if the input begins with the characters "RM" (case
 * insensitive). If so, a predefined training school is displayed. Otherwise
 * a message informs the user that no schools are found.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.search-form');
  const input = form.querySelector('input');
  const resultsContainer = document.getElementById('search-results');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    // Clear any existing results
    resultsContainer.innerHTML = '';
    if (!query) return;
    /*
     * List of motorcycle training schools with associated postcode prefixes
     * and city/area keywords. These prefixes and keywords are used
     * by the search logic to determine which schools to show based on
     * the visitor’s query.
     */
    const schools = [
      {
        name: 'Edventure Rider Motorcycle Training (West Thurrock)',
        address: 'Cowdray Hall, 560 London Road, West Thurrock, RM20 3BJ',
        description:
          'MCIAC‑accredited instructors offering CBT and full licence courses for all levels. The West Thurrock venue features onsite parking and a fleet of well‑maintained motorcycles.',
        postcodePrefix: 'RM',
        keywords: ['WEST THURROCK', 'THURROCK', 'GRAYS'],
        rating: 4.9,
        reviewsCount: 587,
        reviewSnippet:
          'Supportive and knowledgeable instructors like Bart and Ian create a friendly atmosphere and emphasise safety. Reviewers appreciate the well‑maintained bikes and training facilities and praise the high service quality from patient and supportive instructors.',
        // Include an array of image filenames to show in the card. These
        // images live in the website/images directory and provide a visual
        // preview of the West Thurrock training facility. Additional
        // photos can be added to this array as more become available.
        photos: ['west_thurrock_photo1.png'],
        bookable: true,
        branch: 'Edventure Rider West Thurrock',
      },
      {
        name: 'Edventure Rider Motorcycle Training (Chafford Hundred)',
        address: 'Fleming Road, Chafford Hundred, Grays, RM16 6YJ',
        description:
          'Friendly instructors provide CBT and progression courses at the Chafford Hundred site in Grays. Ideal for new riders looking for professional guidance close to home.',
        postcodePrefix: 'RM',
        keywords: ['CHAFFORD HUNDRED', 'GRAYS', 'THURROCK'],
        rating: 4.7,
        reviewsCount: 77,
        reviewSnippet:
          'Reviews highlight the comprehensive training experience at Chafford Hundred with professional, supportive instructors who instil confidence and emphasise safety. Students appreciate the well‑maintained equipment and clean facilities, as well as the convenient location. Service quality receives high praise, with instructors described as friendly, patient and supportive.',
        bookable: true,
        branch: 'Edventure Rider Chafford Hundred',
      },
    // Edventure Rider’s Chingford branch. This new entry brings all the same
    // features as the other Edventure locations including rating, review
    // snippet, photos and full booking functionality. Postcode prefix and
    // keywords ensure the search returns this branch when users enter
    // Chingford‑related queries.
    {
      name: 'Edventure Rider Motorcycle Training (Chingford)',
      address: '3 Morrison Avenue, Chingford, London, E4 8SN',
      description:
        'This Chingford training centre offers a supportive and engaging environment for CBT and full licence courses. Professional instructors provide clear guidance, helping students feel confident and well‑prepared.',
      postcodePrefix: 'E4',
      keywords: ['CHINGFORD', 'MORRISON', 'MORRISONS', 'MORRISON AVENUE', 'E4', 'WALTHAMSTOW'],
      rating: 4.8,
      reviewsCount: 1398,
      reviewSnippet:
        'Students praise the supportive, engaging environment and professional instructors like Ian and Marco for their friendly demeanour and clear communication. Many riders leave feeling confident and well‑prepared, and the school is highly recommended for its effective teaching methods, positive atmosphere and outstanding service quality.',
      photos: ['west_thurrock_photo1.png'],
      bookable: true,
      branch: 'Edventure Rider Chingford',
    },
      {
        name: 'C View Motorcycle Training',
        address: 'Bromfords School, Grange Avenue, Wickford, SS12 0LZ',
        description:
          'Based at Bromfords School in Wickford, C View delivers CBT and full licence training using a safe off‑road area and experienced instructors.',
        postcodePrefix: 'SS',
        keywords: ['WICKFORD'],
      },
      {
        name: 'ART Rider Training',
        address: 'Unit L Wrexham Road, Basildon, SS15 6PX',
        description:
          'This Basildon‑based school offers novice and experienced riders CBT and DAS courses. The training site provides plenty of space for developing road skills.',
        postcodePrefix: 'SS',
        keywords: ['BASILDON'],
      },
      {
        name: 'Pass Bike Motorcycle Training',
        address: 'Yard 2, 8 Purdeys Way, Rochford, SS4 1NE',
        description:
          'Southend’s Pass Bike centre runs CBT, A2 and Direct Access courses from its Rochford training facility. Riders benefit from qualified instructors and well‑maintained bikes.',
        postcodePrefix: 'SS',
        keywords: ['ROCHFORD', 'SOUTHEND'],
      },
      {
        name: 'Probike Training',
        address: '3 Russell Way, Chelmsford, CM1 3AA',
        description:
          'Situated in Chelmsford, Probike delivers CBT and full licence programmes. The team emphasises personalised coaching to build rider confidence.',
        postcodePrefix: 'CM',
        keywords: ['CHELMSFORD'],
      },
      {
        name: 'Ride Motorcycle Training (Cardrome)',
        address: 'The Car Drome, Upper Rainham Road, Hornchurch, RM12 4EU',
        description:
          'Cardrome Bike Training operates on a large off‑road site in Hornchurch. The school has its own 12‑acre training area and offers CBT and full licence courses accessible via Elm Park station.',
        postcodePrefix: 'RM',
        keywords: ['HORNCHURCH', 'ROMFORD'],
      },
      {
        name: 'Universal Motorcycle Training',
        address: 'Goals Dagenham, Ripple Road, Dagenham, RM9 6XW',
        description:
          'Located at Goals Dagenham, this school provides CBT and progression courses in a friendly environment with experienced instructors.',
        postcodePrefix: 'RM',
        keywords: ['DAGENHAM'],
      },
      {
        name: 'SL Motorcycle Training',
        address: 'Barking Rugby Union Football Club, Dagenham, RM9 4TX',
        description:
          'SL Motorcycle Training holds CBT sessions at Barking Rugby Union Football Club. The instructors pride themselves on a patient approach for beginners.',
        postcodePrefix: 'RM',
        keywords: ['DAGENHAM', 'BARKING'],
      },
    ];
    /*
     * Filtering logic: determine which schools match the user’s query.
     * A school matches if the query starts with the same postcode prefix
     * (two‑letter code) or if the query contains one of the school’s keywords.
     */
    const normalisedQuery = query.toUpperCase().trim();
    const queryNoSpaces = normalisedQuery.replace(/\s+/g, '');
    const schoolsToDisplay = schools.filter((school) => {
      // Match by postcode prefix (e.g., "RM", "SS", "CM")
      const prefixMatch = queryNoSpaces.startsWith(school.postcodePrefix);
      // Match by city/area keyword
      const keywordMatch = school.keywords.some((keyword) => {
        return (
          normalisedQuery.includes(keyword) || keyword.includes(normalisedQuery)
        );
      });
      return prefixMatch || keywordMatch;
    });
    // Show a message if no schools match the query
    if (schoolsToDisplay.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No schools found for the entered postcode or city.';
      resultsContainer.appendChild(message);
    } else {
      schoolsToDisplay.forEach((school, idx) => {
        const card = document.createElement('div');
        card.className = 'school-card';
        // Build the card HTML dynamically. Always show name, address and description.
        let cardHtml = `
          <h4>${school.name}</h4>
          <p><strong>Location:</strong> ${school.address}</p>
          <p>${school.description}</p>
        `;
        // If rating information is available, include it.
        if (school.rating) {
          const ratingText = `${school.rating.toFixed(1)}/5 (${school.reviewsCount} Google reviews)`;
          cardHtml += `<p><strong>Rating:</strong> ${ratingText}</p>`;
        }
        // If a review snippet is provided, display it in italics.
        if (school.reviewSnippet) {
          cardHtml += `<p><em>${school.reviewSnippet}</em></p>`;
        }
        // If photos are provided, build a small gallery. Each photo
        // filename should correspond to an image stored in the
        // website/assets directory. The images will be displayed in a
        // flex container so they wrap nicely on smaller screens.
        if (school.photos && school.photos.length > 0) {
          cardHtml += '<div class="photo-gallery">';
          school.photos.forEach((photo) => {
            cardHtml += `<img src="assets/${photo}" alt="Photo of ${school.name}" class="school-photo">`;
          });
          cardHtml += '</div>';
        }
        // If the school is bookable (Edventure Rider branches), append a booking button
        // and a hidden booking form container. Each element gets a unique ID based on idx.
        if (school.bookable) {
          cardHtml += `
            <button class="btn btn-primary book-btn" id="book-btn-${idx}">Book CBT</button>
            <div class="card-booking hidden" id="booking-${idx}">
              <label for="booking-branch-${idx}">Branch</label>
              <select id="booking-branch-${idx}" name="branch"></select>
              <label for="booking-date-${idx}">Date</label>
              <select id="booking-date-${idx}" name="date"></select>
              <label for="booking-bike-${idx}">Bike Type</label>
              <select id="booking-bike-${idx}" name="bike-type">
                <option value="manual">Manual – £199 (includes bike hire)</option>
                <option value="automatic">Automatic – £189 (includes bike hire)</option>
                <option value="own">Own Bike – £169</option>
              </select>
              <label for="booking-age-${idx}">Your Age</label>
              <input type="number" id="booking-age-${idx}" name="age" min="16" required />
              <label for="booking-licence-${idx}">Driving licence number</label>
              <input type="text" id="booking-licence-${idx}" name="licence" required />
              <label for="booking-address-${idx}">Home address</label>
              <textarea id="booking-address-${idx}" name="address" rows="2" required></textarea>
              <label for="booking-postcode-${idx}">Postcode</label>
              <input type="text" id="booking-postcode-${idx}" name="postcode" required />
              <label for="booking-phone-${idx}">Phone number</label>
              <input type="tel" id="booking-phone-${idx}" name="phone" required />
              <label for="booking-email-${idx}">Email address</label>
              <input type="email" id="booking-email-${idx}" name="email" required />
              <div class="card-terms">
                <p class="terms-text">
                  We provide helmets, gloves and jackets. Students must attend wearing
                  jeans and sturdy boots above the ankle in compliance with DVSA rules.
                  16‑year‑olds are only allowed on 50cc motorcycles.
                </p>
                <label class="terms-checkbox">
                  <input type="checkbox" id="booking-accept-${idx}" />
                  I accept these terms and conditions.
                </label>
              </div>
              <button class="btn btn-secondary book-submit" id="booking-submit-${idx}" disabled>Book Now</button>
              <div class="booking-message" id="booking-message-${idx}"></div>
            </div>
          `;
        }
        card.innerHTML = cardHtml;
        resultsContainer.appendChild(card);

        // If this card is bookable, attach event handlers for booking interactions
        if (school.bookable) {
          const bookBtn = card.querySelector(`#book-btn-${idx}`);
          const bookingContainer = card.querySelector(`#booking-${idx}`);
          const branchSelect = card.querySelector(`#booking-branch-${idx}`);
          const dateSelect = card.querySelector(`#booking-date-${idx}`);
          const bikeSelect = card.querySelector(`#booking-bike-${idx}`);
          const ageInput = card.querySelector(`#booking-age-${idx}`);
          const licenceInput = card.querySelector(`#booking-licence-${idx}`);
          const addressInput = card.querySelector(`#booking-address-${idx}`);
          const acceptChk = card.querySelector(`#booking-accept-${idx}`);
          const submitBtn = card.querySelector(`#booking-submit-${idx}`);
          const messageDiv = card.querySelector(`#booking-message-${idx}`);
          const postcodeInput = card.querySelector(`#booking-postcode-${idx}`);
          const phoneInput = card.querySelector(`#booking-phone-${idx}`);
          const emailInput = card.querySelector(`#booking-email-${idx}`);
          let availabilityLoaded = false;

          /**
           * Fallback generator to produce an array of the next 14 calendar dates
           * starting from tomorrow. Returns ISO date strings.
           */
          function generateNextDates() {
            const dates = [];
            const today = new Date();
            for (let i = 1; i <= 14; i++) {
              const d = new Date(today);
              d.setDate(today.getDate() + i);
              const iso = d.toISOString().split('T')[0];
              dates.push(iso);
            }
            return dates;
          }

          // Store full availability data to update date options when branch changes
          let availabilityData = [];

          /**
           * Populate branch and date selects using the loaded availability data.
           * For branch-specific availability, update date options based on the
           * currently selected branch. Colours indicate availability: green for
           * available and red for unavailable dates. Unavailable options are
           * disabled.
           */
          function populateDateOptions(selectedBranch) {
            if (!dateSelect || !availabilityData) return;
            // Clear existing options
            dateSelect.innerHTML = '';
            availabilityData.forEach((item) => {
              const dateVal = item.date;
              const branchAvail = item.availability && item.availability[selectedBranch] !== undefined
                ? item.availability[selectedBranch]
                : true;
              // Convert ISO date to UK format for display
              let displayDate = dateVal;
              if (dateVal && dateVal.includes('-')) {
                const parts = dateVal.split('-');
                if (parts.length === 3) {
                  displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
              }
              const opt = document.createElement('option');
              opt.value = dateVal;
              opt.textContent = displayDate;
              if (!branchAvail) {
                opt.disabled = true;
                opt.style.backgroundColor = '#ffe6e6';
                opt.style.color = 'red';
              } else {
                opt.style.backgroundColor = '#e6ffe6';
                opt.style.color = 'green';
              }
              dateSelect.appendChild(opt);
            });
          }

          /**
           * Load availability from the backend API. On success, populate the
           * branch select and store the availability data. If the API call
           * fails, create fallback availability with all dates available for
           * each branch. After loading, call populateDateOptions for the
           * currently selected branch.
           */
          function loadAvailability() {
            fetch('http://localhost:3000/api/availability')
              .then((res) => res.json())
              .then((data) => {
                // Populate branch select
                if (data.branches && branchSelect) {
                  branchSelect.innerHTML = '';
                  data.branches.forEach((b) => {
                    const opt = document.createElement('option');
                    opt.value = b;
                    opt.textContent = b;
                    branchSelect.appendChild(opt);
                  });
                }
                // Store the full availability data (array of objects)
                if (data.dates) {
                  availabilityData = data.dates;
                }
                // Determine initial branch selection: use the school's branch if defined
                let initialBranch = school.branch || (data.branches && data.branches[0]);
                if (initialBranch && branchSelect) {
                  branchSelect.value = initialBranch;
                }
                // Populate dates for the initial branch
                populateDateOptions(initialBranch);
                availabilityLoaded = true;
              })
              .catch((err) => {
                console.warn('API unavailable, using fallback availability', err);
                // Fallback branches: include all Edventure Rider locations. Add
                // new branches here as they are introduced. These branches
                // populate the branch dropdown when the API is unavailable.
                const fallbackBranches = [
                  'Edventure Rider West Thurrock',
                  'Edventure Rider Chafford Hundred',
                  'Edventure Rider Chingford',
                ];
                branchSelect.innerHTML = '';
                fallbackBranches.forEach((b) => {
                  const opt = document.createElement('option');
                  opt.value = b;
                  opt.textContent = b;
                  branchSelect.appendChild(opt);
                });
                // Create fallback availability: all dates available for all branches
                const isoDates = generateNextDates();
                availabilityData = isoDates.map((d) => {
                  const availability = {};
                  fallbackBranches.forEach((b) => {
                    availability[b] = true;
                  });
                  return { date: d, availability };
                });
                // Use school's branch or first fallback
                let initialBranch = school.branch || fallbackBranches[0];
                if (initialBranch && branchSelect) {
                  branchSelect.value = initialBranch;
                }
                populateDateOptions(initialBranch);
                availabilityLoaded = true;
              });
          }

          // When the selected branch changes, update available dates accordingly
          branchSelect.addEventListener('change', () => {
            const selected = branchSelect.value;
            populateDateOptions(selected);
          });

          // Toggle booking form visibility and load availability when first shown
          bookBtn.addEventListener('click', () => {
            if (bookingContainer.classList.contains('hidden')) {
              bookingContainer.classList.remove('hidden');
              if (!availabilityLoaded) {
                loadAvailability();
              }
            } else {
              bookingContainer.classList.add('hidden');
            }
          });
          // Enable submit button when terms accepted
          acceptChk.addEventListener('change', () => {
            submitBtn.disabled = !acceptChk.checked;
          });
          // Handle booking submission
          submitBtn.addEventListener('click', () => {
            messageDiv.textContent = '';
            const selectedDate = dateSelect.value;
            const selectedBranch = branchSelect.value;
            const bikeType = bikeSelect.value;
            const ageVal = ageInput.value;
            const licenceVal = licenceInput.value.trim();
            const addressVal = addressInput.value.trim();
            const postcodeVal = postcodeInput.value.trim();
            const phoneVal = phoneInput.value.trim();
            const emailVal = emailInput.value.trim();
            fetch('http://localhost:3000/api/book', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                branch: selectedBranch,
                date: selectedDate,
                bikeType: bikeType,
                age: ageVal,
                licence: licenceVal,
                address: addressVal,
                postcode: postcodeVal,
                phone: phoneVal,
                email: emailVal,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  messageDiv.textContent = data.error;
                  messageDiv.className = 'error';
                } else {
                  messageDiv.textContent = data.message;
                  messageDiv.className = 'success';
                  // Reset form fields and disable button again
                  branchSelect.selectedIndex = 0;
                  dateSelect.selectedIndex = 0;
                  bikeSelect.selectedIndex = 0;
                  ageInput.value = '';
                  licenceInput.value = '';
                  addressInput.value = '';
                  postcodeInput.value = '';
                  phoneInput.value = '';
                  emailInput.value = '';
                  acceptChk.checked = false;
                  submitBtn.disabled = true;
                }
              })
              .catch((err) => {
                console.error('Booking failed', err);
                messageDiv.textContent = 'Booking failed. Please try again.';
                messageDiv.className = 'error';
              });
          });
        }
      });
    }
    // Scroll results into view
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  });


  /*
   * Quiz functionality. A short quiz helps visitors determine whether they
   * should consider training on an automatic or manual bike. When the
   * "Start Quiz" button is clicked, the CTA section is hidden, the quiz
   * section becomes visible, and a series of multiple choice questions is
   * displayed. Based on the user’s answers, a recommendation is provided.
   */
  const startQuizButton = document.getElementById('start-quiz');
  const ctaSection = document.getElementById('cta-section');
  const quizSection = document.getElementById('quiz-section');
  const quizContainer = document.getElementById('quiz-container');

  // Define the quiz questions and answer values.
  const quizQuestions = [
    {
      question: 'Have you ever ridden a motorcycle before?',
      options: [
        { text: 'Yes', value: 'manual' },
        { text: 'No', value: 'auto' },
      ],
    },
    {
      question: 'Do you plan to commute daily or ride occasionally?',
      options: [
        { text: 'Daily commute', value: 'auto' },
        { text: 'Occasional weekend rides', value: 'manual' },
        { text: 'A mix of both', value: 'manual' },
      ],
    },
    {
      question: 'Are you comfortable with manually shifting gears?',
      options: [
        { text: 'Yes', value: 'manual' },
        { text: 'No', value: 'auto' },
        { text: 'Not sure', value: 'auto' },
      ],
    },
    {
      question: 'Which riding environment will you use most often?',
      options: [
        { text: 'Mostly city/urban', value: 'auto' },
        { text: 'Mostly countryside/open roads', value: 'manual' },
        { text: 'A mix of both', value: 'manual' },
      ],
    },
    {
      question: 'Do you prefer ease of use or performance and control?',
      options: [
        { text: 'Ease of use', value: 'auto' },
        { text: 'Performance and control', value: 'manual' },
        { text: 'Both equally', value: 'manual' },
      ],
    },
    {
      question: 'Do you plan to carry a passenger regularly?',
      options: [
        { text: 'Yes', value: 'manual' },
        { text: 'No', value: 'auto' },
      ],
    },
    {
      question: 'How important is fuel efficiency to you?',
      options: [
        { text: 'Very important', value: 'auto' },
        { text: 'Somewhat important', value: 'manual' },
        { text: 'Not important', value: 'manual' },
      ],
    },
    {
      question: 'Would you enjoy working on mechanical aspects of your bike?',
      options: [
        { text: 'Yes, I want to learn mechanical skills', value: 'manual' },
        { text: 'No, I prefer less maintenance', value: 'auto' },
      ],
    },
    {
      question: 'How would you describe your learning style?',
      options: [
        { text: 'I like simple and straightforward approaches', value: 'auto' },
        { text: 'I enjoy mastering new skills and techniques', value: 'manual' },
      ],
    },
    {
      question: 'Are you comfortable balancing a heavier motorcycle?',
      options: [
        { text: 'Yes, heavier bikes are fine', value: 'manual' },
        { text: 'No, I prefer lighter, more manageable bikes', value: 'auto' },
      ],
    },
  ];

  /**
   * Builds and renders the quiz form. When the form is submitted, it evaluates
   * the user’s responses and displays a recommendation.
   */
  function buildQuiz() {
    if (!quizContainer) return;
    quizContainer.innerHTML = '';
    const form = document.createElement('form');
    // Iterate over each question and create radio buttons
    quizQuestions.forEach((q, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'question';
      const heading = document.createElement('h3');
      heading.textContent = `${index + 1}. ${q.question}`;
      wrapper.appendChild(heading);
      q.options.forEach((opt) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = opt.value;
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${opt.text}`));
        wrapper.appendChild(label);
      });
      form.appendChild(wrapper);
    });
    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit Quiz';
    form.appendChild(submitBtn);
    // Handle quiz submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let manualScore = 0;
      let autoScore = 0;
      quizQuestions.forEach((q, idx) => {
        const selected = form.querySelector(
          `input[name="question-${idx}"]:checked`
        );
        if (selected) {
          if (selected.value === 'manual') manualScore++;
          else if (selected.value === 'auto') autoScore++;
        }
      });
      // Determine recommendation
      let recommendation;
      if (manualScore > autoScore) {
        recommendation =
          'Based on your answers, a manual motorcycle may suit you best. Manual bikes offer more control and performance, especially on open roads, and are ideal for riders who enjoy mastering new skills.';
      } else if (autoScore > manualScore) {
        recommendation =
          'Based on your answers, an automatic (twist‑and‑go) scooter or motorcycle may be more suitable. Automatics are easier to handle in city traffic, require less maintenance and gear‑shifting, and are perfect for a simple commuting experience.';
      } else {
        recommendation =
          'Your answers suggest that either a manual or an automatic motorcycle could work for you. If you’re unsure, consider starting on an automatic to build confidence and then progress to a manual bike once you feel comfortable.';
      }
      // Display the result
      quizContainer.innerHTML = '';
      const resultDiv = document.createElement('div');
      resultDiv.className = 'result';
      resultDiv.innerHTML = `<h3>Your Recommendation</h3><p>${recommendation}</p>`;
      // Add a button to retake the quiz or return
      const retakeBtn = document.createElement('button');
      retakeBtn.type = 'button';
      retakeBtn.className = 'btn btn-secondary';
      retakeBtn.textContent = 'Retake Quiz';
      retakeBtn.addEventListener('click', () => {
        buildQuiz();
      });
      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'btn btn-secondary';
      backBtn.textContent = 'Back to Site';
      backBtn.style.marginLeft = '0.5rem';
      backBtn.addEventListener('click', () => {
        // Hide quiz and show CTA again
        quizSection.classList.add('hidden');
        ctaSection.classList.remove('hidden');
        // Remove previous content
        quizContainer.innerHTML = '';
      });
      resultDiv.appendChild(retakeBtn);
      resultDiv.appendChild(backBtn);
      quizContainer.appendChild(resultDiv);
    });
    quizContainer.appendChild(form);
  }

  // Attach click handler to start quiz button
  if (startQuizButton && ctaSection && quizSection) {
    startQuizButton.addEventListener('click', () => {
      // Hide CTA section and show quiz section
      ctaSection.classList.add('hidden');
      quizSection.classList.remove('hidden');
      // Build and display the quiz
      buildQuiz();
    });
  }
});