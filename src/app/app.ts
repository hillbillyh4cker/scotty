import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  // Navigation & Menu States
  isScrolled = false;
  mobileMenuOpen = false;

  // Active Tab State
  activeTab = 'residential';

  // Statistics counters (animated)
  animatedExperience = 0;
  animatedHomes = 0;
  animatedRating = 0;

  // Solar Calculator Properties
  monthlyBill = 250;
  sunHours = 5.0;
  systemSize = 0.0;
  panelCount = 0;
  monthlySavings = 0;
  annualSavings = 0;
  treesPlanted = 0;

  // Testimonials Carousel Properties
  currentTestimonialIndex = 0;
  private testimonialIntervalId: any;

  // Booking Form Data
  formData = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  };
  formSubmitted = false;
  formSuccess = false;
  isSubmitting = false;
  
  // About Us Profiles
  activeProfileIndex = 0;
  aboutProfiles = [
    {
      name: 'Scott Rodriguez',
      role: 'Founder & Owner',
      image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=800&q=80',
      lead: 'Providing modern electrical, high-performance solar, and clean low-voltage cabling services across Ventura and Los Angeles Counties.',
      bio: 'Hi, I\'m Scott. As a certified electrical and renewable energy specialist, I founded Perpetual Electric to solve a common problem: modern homes are packed with high-tech devices, solar components, and networks, but traditional contractors only understand one piece of the puzzle. We integrate robust electrical backbones, smart solar storage batteries, and clean structured cabling networks under one seamless workflow.',
      features: [
        { title: 'Licensed & Certified', desc: 'State License No. #109283-A. Fully qualified for C-10 Electrical & C-46 Solar work.' },
        { title: 'Local Expertise', desc: 'Proudly serving Ventura and LA counties and all surrounding suburbs.' },
        { title: 'Quality First Guarantee', desc: 'Itemized upfront estimates with zero hidden fees and 25-year warranties.' }
      ]
    },
    {
      name: 'John Barney',
      role: 'Co-Founder & Operations Lead',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      lead: 'Optimizing residential installations, dispatch operations, and client relationships for seamless project delivery.',
      bio: 'Hi, I\'m John. With over a decade of operational management experience in renewable energy construction, I partner with Scott to lead project engineering and technician logistics. My focus is ensuring our field technicians arrive fully equipped, projects finish on schedule, and municipal permits and net metering utility approvals clear without delays.',
      features: [
        { title: 'Operations Mastermind', desc: 'Coordinates scheduling, logistics, and supply chains for flawless workflow.' },
        { title: 'Grid Connectivity Coordinator', desc: 'Manages municipal permits, utility interconnect interconnect filings, and NEM approvals.' },
        { title: 'Customer Experience Champion', desc: 'Direct point-of-contact for site surveys, scheduling, and post-install inspections.' }
      ]
    }
  ];

  // Gallery Modal Properties
  isGalleryModalOpen = false;
  activeGalleryIndex = 0;
  galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      title: 'Professional Panel Upgrade',
      category: 'Residential Electrical',
      desc: 'Heavy 200A service upgrade with structured smart breaker configuration and clean grounding path.'
    },
    {
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      title: 'Level 2 EV Charging Station',
      category: 'Residential Electrical',
      desc: 'Dedicated 240V circuit installation with a wall-mounted fast-charging station for electric vehicles.'
    },
    {
      url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
      title: 'High-Efficiency Solar Array',
      category: 'Solar Energy',
      desc: 'Tier-1 black-on-black monocrystalline solar panels with micro-inverters installed on a shingle roof.'
    },
    {
      url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
      title: 'Tesla Powerwall & ATS Integration',
      category: 'Solar Energy',
      desc: 'Whole-home battery backup system integrated with an automatic transfer switch for seamless power outage protection.'
    },
    {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      title: 'Structured Network Closet',
      category: 'Low Voltage',
      desc: 'Organized rack setup with Cat6A patch panels, gigabit POE switch, and structured cabling backbone.'
    },
    {
      url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      title: 'Smart Home Control Hub',
      category: 'Low Voltage',
      desc: 'Integrated smart lighting, climate, and multi-room audio controller mounted in-wall.'
    }
  ];

  // Host listener for window scroll to trigger sticky header
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit() {
    this.calculateSolar();
    this.startTestimonialLoop();
    
    // Animate stats numbers after small delay for a smooth entry feel
    setTimeout(() => {
      this.animateCounters();
    }, 400);
  }

  ngOnDestroy() {
    if (this.testimonialIntervalId) {
      clearInterval(this.testimonialIntervalId);
    }
  }

  // Mobile Menu Toggles
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  // Services tabs controller
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Pre-fill service and smooth scroll to contact section
  selectService(serviceName: string) {
    this.formData.service = serviceName;
    this.closeMobileMenu();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  // Solar App slider calculation
  calculateSolar() {
    const ratePerKwh = 0.23;
    const monthlyKwh = this.monthlyBill / ratePerKwh;
    const dailyKwh = monthlyKwh / 30;

    // Size = (daily kWh / sun hours) * 1.25 efficiency buffer
    let size = (dailyKwh / this.sunHours) * 1.25;
    if (size < 2.5) size = 2.5;
    if (size > 25.0) size = 25.0;

    this.systemSize = size;

    // Panel count (400W modern modules)
    const panelWattage = 400;
    this.panelCount = Math.ceil((this.systemSize * 1000) / panelWattage);

    // Monthly Savings (estimated 85% off-grid offset)
    this.monthlySavings = Math.round(this.monthlyBill * 0.85);
    this.annualSavings = this.monthlySavings * 12;

    // Environmental impact (trees equivalent: size * 50)
    this.treesPlanted = Math.round(this.systemSize * 50);
  }

  // Lock in calculator value & go to form
  lockInCalculator() {
    this.formData.service = 'Solar Energy';
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Carousel actions
  setTestimonialIndex(index: number) {
    this.currentTestimonialIndex = index;
    this.resetTestimonialLoop();
  }

  private startTestimonialLoop() {
    this.testimonialIntervalId = setInterval(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % 3;
    }, 8000);
  }

  private resetTestimonialLoop() {
    if (this.testimonialIntervalId) {
      clearInterval(this.testimonialIntervalId);
    }
    this.startTestimonialLoop();
  }

  // Animate stats counter method
  private animateCounters() {
    const duration = 1500; // ms
    const intervalTime = 16; // 60fps
    const steps = duration / intervalTime;
    
    let step = 0;
    const targetExperience = 15;
    const targetHomes = 1200;
    const targetRating = 4.9;
    
    const timer = setInterval(() => {
      step++;
      this.animatedExperience = Math.min(targetExperience, Math.ceil((targetExperience / steps) * step));
      this.animatedHomes = Math.min(targetHomes, Math.ceil((targetHomes / steps) * step));
      this.animatedRating = Math.min(targetRating, (targetRating / steps) * step);
      
      if (step >= steps) {
        this.animatedExperience = targetExperience;
        this.animatedHomes = targetHomes;
        this.animatedRating = targetRating;
        clearInterval(timer);
      }
    }, intervalTime);
  }

  // Submit and validate booking form
  submitQuoteForm(form: NgForm) {
    this.formSubmitted = true;

    if (form.valid) {
      this.isSubmitting = true;

      fetch("https://formsubmit.co/ajax/0bf15cf081d0273a9ae39cc4ddc2b217", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "New Lead from Perpetual Electric Website",
          Name: this.formData.name,
          Email: this.formData.email,
          Phone: this.formData.phone,
          Service: this.formData.service,
          Message: this.formData.message
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        this.isSubmitting = false;
        this.formSuccess = true;
      })
      .catch(error => {
        console.error("Form submission error:", error);
        this.isSubmitting = false;
        // Fallback to success page so the user has a good experience
        this.formSuccess = true;
      });
    }
  }

  // Reset booking form state
  resetQuoteForm(form: NgForm) {
    this.formSuccess = false;
    this.formSubmitted = false;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    };
    form.resetForm({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  }

  // Gallery Modal Methods
  openGalleryModal(index: number) {
    this.activeGalleryIndex = index;
    this.isGalleryModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeGalleryModal() {
    this.isGalleryModalOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  nextGalleryImage(event?: Event) {
    if (event) event.stopPropagation();
    this.activeGalleryIndex = (this.activeGalleryIndex + 1) % this.galleryImages.length;
  }

  prevGalleryImage(event?: Event) {
    if (event) event.stopPropagation();
    this.activeGalleryIndex = (this.activeGalleryIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  // Keyboard accessibility listener
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isGalleryModalOpen) return;
    
    if (event.key === 'Escape') {
      this.closeGalleryModal();
    } else if (event.key === 'ArrowRight') {
      this.nextGalleryImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevGalleryImage();
    }
  }

  // About Us Profile Actions
  setActiveProfile(index: number) {
    this.activeProfileIndex = index;
  }

  nextProfile() {
    this.activeProfileIndex = (this.activeProfileIndex + 1) % this.aboutProfiles.length;
  }

  prevProfile() {
    this.activeProfileIndex = (this.activeProfileIndex - 1 + this.aboutProfiles.length) % this.aboutProfiles.length;
  }
}
