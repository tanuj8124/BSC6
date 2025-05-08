document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  
  menuToggle.addEventListener('click', function() {
      navbar.classList.toggle('active');
      this.classList.toggle('fa-times');
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.navbar a').forEach(link => {
      link.addEventListener('click', () => {
          navbar.classList.remove('active');
          menuToggle.classList.remove('fa-times');
      });
  });
  
  // Header scroll effect
  window.addEventListener('scroll', function() {
      const header = document.querySelector('.header');
      header.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Add this mock transport data near the top of your script
// Transport data - Add this at the top of your main.js
// Transport data - Add this at the top of your main.js
const transportData = {
    "Chitrakote Falls": {
        options: [
            { type: "Bus", cost: "₹300-500", time: "4-5 hours", details: "Regular buses from Raipur to Jagdalpur, then local transport" },
            { type: "Train", cost: "₹200-400", time: "5-6 hours", details: "Nearest station: Jagdalpur (30km from falls)" },
            { type: "Private Taxi", cost: "₹3000-4000", time: "3-4 hours", details: "Direct from Raipur with scenic route" }
        ],
        bestOption: "Private Taxi for comfort and time efficiency"
    },
    "Barnawapara Sanctuary": {
        options: [
            { type: "Bus", cost: "₹200-400", time: "3-4 hours", details: "Direct buses from Raipur to Mahasamund" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Mahasamund (20km from sanctuary)" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "ratanpur": {
        options: [
            { type: "Bus", cost: "₹200-400", time: "3-4 hours", details: "Direct buses from Raipur to Mahasamund" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Mahasamund (20km from sanctuary)" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "maitri bagh": {
        options: [
            { type: "Bus", cost: "₹200-400", time: "3-4 hours", details: "Direct buses from Raipur to Mahasamund" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Mahasamund (20km from sanctuary)" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "satrenga dam": {
        options: [
            { type: "Bus", cost: "₹200-400", time: "3-4 hours", details: "Direct buses from Raipur to Mahasamund" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Mahasamund (20km from sanctuary)" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "nandanvan": {
        options: [
            { type: "Bus", cost: "₹350", time: "3.5 hours", details: "Direct buses from Bilaspur to Raipur" },
            { type: "Train", cost: "₹150", time: "4 hours", details: "Nearest station: Raipur" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "4 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Railways"
    },
    "tirathgarh": {
        options: [
            { type: "Bus", cost: "₹1400", time: "9.5-10hours", details: "Direct buses from Raipur to Jagdalpur" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Jagdalpur" },
            { type: "Private Taxi", cost: "₹7000", time: "8.5 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Public Transport"
    },
    "chaiturgarh": {
        options: [
            { type: "Bus", details: "NA" },
            { type: "Train",details: "NA" },
            { type: "Private Taxi", cost: "₹2500-3000", time: "1.5 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Vehicle"
    },
    "bastar": {
        options: [
            { type: "Bus", cost: "₹500-700", time: "9 hours", details: "Direct buses from Raipur to Bastar" },
            { type: "Train", details: "NA" },
            { type: "Private Taxi", cost: "₹6000-6500", time: "8 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi"
    },
    "dhamtari": {
        options: [
            { type: "Bus", cost: "500", time: "3-4 hours", details: "Direct buses from Raipur to Dhamtari" },
            { type: "Train",details: "NA" },
            { type: "Private Taxi", cost: "₹3500-4000", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Prublic Transport"
    },
    "bhoramdeo": {
        options: [
            { type: "Bus", cost: "₹400", time: "4 hours", details: "Direct buses from Bilaspur to Kawardha" },
            { type: "Train", details: "NA" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi "
    },
    "gangrel": {
        options: [
            { type: "Bus", cost: "₹500", time: "3.8-4 hours", details: "Direct buses from Raipur to Dhamtari" },
            { type: "Train", details: "NA" },
            { type: "Private Taxi", cost: "₹3500-4000", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Prublic Transport"
    },
    "sirpur": {
        options: [
            { type: "Bus", cost: "₹300", time: "3.5 hours", details: " No Direct buses from Bilaspur to Sirpur" },
            { type: "Train", details: "NA" },
            { type: "Private Taxi", cost: "3000", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi"
    },
    "dongargarh": {
        options: [
            { type: "Bus", cost: "₹450-500", time: "6 hours", details: " No Direct buses from Bilaspur to Dongargarh" },
            { type: "Train", cost: "₹220", time: "3.3 hours", details: "Nearest station: Dongargarh" },
            { type: "Private Taxi", cost: "₹4500-5000", time: "4.5hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Train from Bilaspur"
    },
    "shivrinarayan": {
        options: [
            { type: "Bus", cost: "₹100", time: "2 hours", details: "Direct buses from Bilaspur to Shivarinarayan" },
            { type: "Train", details: "NA" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "1.5 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Public Transport"
    },
    "rajim": {
        options: [
            { type: "Bus", cost: "₹400", time: "3.5-4 hours", details: " Buses from Bilaspur to Raipur - Raipur to Rajim" },
            { type: "Train", details: "NA" },
            { type: "Private Taxi", cost: "₹2000-3000", time: "3.5hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Vehicle"
    },
    "giraudpuri": {
        options: [
            { type: "Bus", cost: "₹200-250", time: "3-4 hours", details: "Direct buses from Bilaspur to Giraudpuri" },
            { type: "Train",details: "NA" },
            { type: "Private Taxi", cost: "₹2000-2500", time: "2 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Public Transport"
    },
    "bhilai": {
        options: [
            { type: "Bus", cost: "₹400", time: "3-4 hours", details: "Bilaspur to Raipur - Raipur to Bhilai" },
            { type: "Train", cost: "₹200", time: "4 hours", details: "Nearest station: Mahasamund (20km from sanctuary)" },
            { type: "Private Taxi", cost: "₹2500-3000", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Bhilai steel plant"
    },
    "kanger": {
        options: [
            { type: "Bus", cost: "₹1300", time: "10+ hours", details: "Direct buses from Raipur to Kanger" },
            { type: "Train", details: "---" },
            { type: "Private Taxi", cost: "₹5000-6000", time: "8.4 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "ghatarani": {
        options: [
            { type: "Bus",  details: "--" },
            { type: "Train",  details: "---" },
            { type: "Private Taxi", cost: "₹3500-4000", time: "4. hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "kotumsar cave": {
        options: [
            { type: "Bus", cost: "₹1200", time: "10 hours", details: "Direct buses from Bilaspur to Bastar" },
            { type: "Train",   details: "---" },
            { type: "Private Taxi", cost: "₹4500-5500", time: "8.5 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "mm funcity": {
        options: [
            { type: "Bus", cost: "₹200-400", time: "3-4 hours", details: "Direct buses from Bilaspur to Raipur" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Mahasamund (20km from sanctuary)" },
            { type: "Private Taxi", cost: "₹2500-3500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "Private Taxi for wildlife enthusiasts with equipment"
    },
    "waterpark": {
        options: [
            { type: "Bus", cost: "₹265", time: "3-4 hours", details: "Direct buses from Raipur to Mahasamund" },
            { type: "Train", cost: "₹150-300", time: "4 hours", details: "Nearest station: Raipur (20km from station)" },
            { type: "Private Vehicle", cost: "1500", time: "2.5-3 hours", details: "Most convenient option with door-to-door service" }
        ],
        bestOption: "For adventure and fun"
    },
    // Add more destinations as needed
};

// Search functionality - Add this to your DOMContentLoaded event listener
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const destination = document.getElementById('destinationSearch').value.trim();
    const date = document.getElementById('travelDate').value;
    const type = document.getElementById('travelType').value;
    
    const resultsContainer = document.querySelector('.search-results-container');
    resultsContainer.innerHTML = '';
    
    if (transportData[destination]) {
        const transportInfo = transportData[destination];
        
        const resultsHTML = `
            <div class="search-results">
                <div class="transport-results">
                    <h3>Transport Options to ${destination}</h3>
                    <p><strong>Recommended:</strong> ${transportInfo.bestOption}</p>
                    
                    <div class="transport-options">
                        ${transportInfo.options.map(option => `
                            <div class="transport-card">
                                <h4>${option.type}</h4>
                                <p><i class="fas fa-money-bill-wave"></i> Cost: ${option.cost}</p>
                                <p><i class="fas fa-clock"></i> Time: ${option.time}</p>
                                <p><i class="fas fa-info-circle"></i> ${option.details}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="search-meta">
                        <p>Search details: ${type} trip on ${date || 'flexible dates'}</p>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
    } else {
        resultsContainer.innerHTML = `
            <div class="search-results">
                <div class="no-results">
                    <p>No transport information found for "${destination}".</p>
                    <p>Please try searching for one of these popular destinations:</p>
                    <ul>
                        ${Object.keys(transportData).map(place => `<li>${place}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
});
  // Back to Top Button
  const backToTop = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
          backToTop.classList.add('active');
      } else {
          backToTop.classList.remove('active');
      }
  });
  
  backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
  
  // Initialize Hero Slider
  const heroSlider = new Swiper('.hero-slider', {
      loop: true,
      autoplay: {
          delay: 5000,
          disableOnInteraction: false,
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });
  
  // Initialize Destinations Slider
  const destinationsSlider = new Swiper('.destinations-slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
      breakpoints: {
          576: {
              slidesPerView: 2,
          },
          768: {
              slidesPerView: 3,
          },
          992: {
              slidesPerView: 4,
          }
      }
  });
  
  // Initialize Testimonials Slider
  const testimonialsSlider = new Swiper('.testimonials-slider', {
      loop: true,
      autoplay: {
          delay: 5000,
          disableOnInteraction: false,
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      breakpoints: {
          768: {
              slidesPerView: 2,
          }
      }
  });
  
  // Load Destinations Data
  fetchDestinations();
  
  // Load Packages Data
  fetchPackages();
  
  // Load Testimonials
  fetchTestimonials();
  
  // Form Submissions
  document.getElementById('searchForm').addEventListener('submit', handleSearch);
  document.getElementById('contactForm').addEventListener('submit', handleContact);
});

// Fetch Destinations from API
async function fetchDestinations() {
  try {
      // In a real app, this would be a fetch to your backend API
      // For demo, we'll use mock data
      const mockDestinations = [
          {
              id: 1,
              name: "Chitrakote Falls",
              location: "Bastar District",
              image: "satrenga damjpg.jpg",
              description: "Often called the Niagara of India, this horseshoe-shaped waterfall is breathtaking during monsoon."
          },
          {
              id: 2,
              name: "Barnawapara Sanctuary",
              location: "Mahasamund District",
              image: "/barnawapara.jpg",
              description: "Home to tigers, leopards, and various bird species in their natural habitat."
          },
          {
              id: 3,
              name: "Tirathgarh Falls",
              location: "Jagdalpur District",
              image: "/tirathgarh.jpg",
              description: "A beautiful multi-tiered waterfall surrounded by lush green forests."
          },
          {
              id: 4,
              name: "Bastar Palace",
              location: "Jagdalpur District",
              image: "/bastar-palace.jpg",
              description: "The royal residence of Bastar's former rulers, showcasing tribal architecture."
          },
          {
              id: 5,
              name: "Maitri Bagh",
              location: "Bhilai District",
              image: "/Maitri bagh.jpg",
              description: "A beautiful garden and zoo developed with Indo-Russian cooperation."
          },
          {
              id: 6,
              name: "Nandanvan Zoo",
              location: "Raipur District",
              image: "/nandanvan raipur.jpg",
              description: "A sprawling zoo and botanical garden with diverse flora and fauna."
          },
          {
            id: 7,
            name: "Water-park",
            location: "Raipur District",
            image: "/MM funcity.jpeg",
            description: "A sprawling zoo and botanical garden with diverse flora and fauna."
          },
          {
            id: 8,
            name: "Steel Plant",
            location: "Durg District",
            image: "/bhilai steel plant.jpeg",
            description: "A sprawling zoo and botanical garden with diverse flora and fauna."
          },
          {
            id: 9,
            name: "Jungle safari",
            location: "Raipur District",
            image: "/jungle safari.jpeg",
            description: "A sprawling zoo and botanical garden with diverse flora and fauna."
          }
      ];
      
      const sliderWrapper = document.querySelector('.destinations-slider .swiper-wrapper');
      sliderWrapper.innerHTML = '';
      
      mockDestinations.forEach(destination => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.innerHTML = `
              <div class="destination-card">
                  <div class="destination-img">
                      <img src="${destination.image}" alt="${destination.name}">
                  </div>
                  <div class="destination-info">
                      <h3>${destination.name}</h3>
                      <p>${destination.location}</p>
                      <p class="description">${destination.description}</p>
                      <a href="#" class="btn">Explore</a>
                  </div>
              </div>
          `;
          sliderWrapper.appendChild(slide);
      });
      
      // Reinitialize slider after adding new slides
      new Swiper('.destinations-slider', {
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
          breakpoints: {
              576: {
                  slidesPerView: 2,
              },
              768: {
                  slidesPerView: 3,
              },
              992: {
                  slidesPerView: 4,
              }
          }
      });
      
  } catch (error) {
      console.error('Error loading destinations:', error);
  }
}

// Fetch Packages from API
async function fetchPackages() {
  try {
      // Mock data - in real app, fetch from backend
      const mockPackages = [
          {
              id: 1,
              name: "Waterfall Wonder",
              duration: "3 Days",
              price: "₹8,999",
              image: "chitrakote-falls.jpg",
              description: "Explore Chhattisgarh's most beautiful waterfalls including Chitrakote and Tirathgarh.",
              includes: ["Accommodation", "Transport", "Guide", "Meals"]
          },
          {
              id: 2,
              name: "Wildlife Adventure",
              duration: "4 Days",
              price: "₹8,499",
              image: "Maitri bagh.jpg",
              description: "Safari experience in Barnawapara Sanctuary with expert naturalists.",
              includes: ["Lodge Stay", "Safaris", "Meals", "Guide"]
          },
          {
              id: 3,
              name: "Tribal Culture Tour",
              duration: "5 Days",
              price: "₹9,999",
              image: "barnawapara.jpg",
              description: "Immerse yourself in the rich tribal culture of Bastar region.",
              includes: ["Homestay", "Cultural Shows", "Meals", "Transport"]
          },
          {
            id: 4,
            name: "Raipur",
            duration: "3 Days",
            price: "₹2,999",
            image: "/MM funcity.jpeg",
            description: "Enjay every place in capital city.",
            includes: ["Waterpark", "Zoo", "Meals", "Transport"]
          },
          
      ];
      
      const packageGrid = document.querySelector('.package-grid');
      packageGrid.innerHTML = '';
      
      mockPackages.forEach(pkg => {
          const packageCard = document.createElement('div');
          packageCard.className = 'package-card';
          packageCard.innerHTML = `
              <div class="package-img">
                  <img src="${pkg.image}" alt="${pkg.name}">
              </div>
              <div class="package-content">
                  <h3>${pkg.name}</h3>
                  <div class="package-meta">
                      <span><i class="fas fa-clock"></i> ${pkg.duration}</span>
                      <span><i class="fas fa-map-marker-alt"></i> Chhattisgarh</span>
                  </div>
                  <p class="package-details">${pkg.description}</p>
                  <div class="package-price">${pkg.price} <span>per person</span></div>
                  <a href="#" class="btn">Book Now</a>
              </div>
          `;
          packageGrid.appendChild(packageCard);
      });
      
  } catch (error) {
      console.error('Error loading packages:', error);
  }
}



// Handle Search Form Submission
function handleSearch(e) {
  e.preventDefault();
  const destination = document.getElementById('destinationSearch').value;
  const date = document.getElementById('travelDate').value;
  const type = document.getElementById('travelType').value;
  
  // In a real app, this would send data to backend and show results
  alert(`Searching for ${type} trips to ${destination} on ${date}`);
  
  // Reset form
  e.target.reset();
}

// Handle Contact Form Submission
function handleContact(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // In a real app, this would send data to backend
  console.log('Contact form submitted:', data);
  alert('Thank you for your message! We will contact you soon.');
  
  // Reset form
  e.target.reset();
}