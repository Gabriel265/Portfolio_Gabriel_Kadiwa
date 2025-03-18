// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Scroll to sections smoothly
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// Project Carousel
document.querySelectorAll('.carousel').forEach(carousel => {
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    let currentIndex = 0;
    
    // Show first item initially
    items[currentIndex].classList.add('active');
    
    // Function to show a specific item
    const showItem = (index) => {
        // Hide all items
        items.forEach(item => item.classList.remove('active'));
        // Show the selected item
        items[index].classList.add('active');
    };
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    });
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }, 5000);
});



// Form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // You would typically send this data to a server
        // For demonstration, we'll just log it and show a success message
        console.log('Form submitted:', formData);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you! Your message has been sent.';
        successMessage.style.color = 'var(--success)';
        successMessage.style.marginTop = '15px';
        
        contactForm.appendChild(successMessage);
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    });
}

// Reveal animations on scroll
const revealElements = document.querySelectorAll('section');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Add these styles to your CSS for the reveal animations
document.head.insertAdjacentHTML('beforeend', `
<style>
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`);

document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.skills-scroll-container');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.error('Back to top button not found in the DOM');
    }
});

// GitHub Projects Integration
document.addEventListener('DOMContentLoaded', function() {
    const username = 'Gabriel265'; // Your GitHub username
    const projectsContainer = document.querySelector('.projects-grid');
    const projectsSection = document.getElementById('projects');
    
    // Check if we're on the projects section
    if (!projectsSection || !projectsContainer) return;
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <p>Loading projects from GitHub...</p>
    `;
    projectsContainer.innerHTML = '';
    projectsContainer.appendChild(loadingIndicator);
    
    // Fetch GitHub repositories
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch GitHub repositories');
            }
            return response.json();
        })
        .then(repos => {
            // Remove loading indicator
            loadingIndicator.remove();
            
            // Filter out forked repositories (optional)
            const ownRepos = repos.filter(repo => !repo.fork);
            
            // Display up to 6 repositories
            const reposToDisplay = ownRepos.slice(0, 6);
            
            if (reposToDisplay.length === 0) {
                projectsContainer.innerHTML = `
                    <div class="no-projects">
                        <p>No public repositories found.</p>
                    </div>
                `;
                return;
            }
            
            // Process each repository
            reposToDisplay.forEach(repo => {
                createProjectCard(repo, projectsContainer);
            });
        })
        .catch(error => {
            console.error('Error fetching GitHub repositories:', error);
            loadingIndicator.remove();
            projectsContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load projects from GitHub. Please try again later.</p>
                </div>
            `;
        });
});

/**
 * Creates a project card for a GitHub repository
 * @param {Object} repo - GitHub repository data
 * @param {HTMLElement} container - Container element to append the card to
 */
function createProjectCard(repo, container) {
    // Extract relevant information
    const {
        name,
        description,
        html_url,
        homepage,
        language,
        topics,
        stargazers_count,
        forks_count
    } = repo;
    
    // Create project card element
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Set default image based on main language
    const languageImage = getLanguageImage(language);
    
    // Create carousel for project images
    const carouselHTML = `
        <div class="project-image">
            <div class="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="${languageImage}" alt="${name} Screenshot">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create project info section
    const projectInfo = document.createElement('div');
    projectInfo.className = 'project-info';
    
    // Create project title
    const projectTitle = document.createElement('h3');
    projectTitle.textContent = formatRepoName(name);
    
    // Create project description
    const projectDesc = document.createElement('p');
    projectDesc.textContent = description || `A ${language || 'code'} repository on GitHub.`;
    
    // Create project tech stack
    const projectTech = document.createElement('div');
    projectTech.className = 'project-tech';
    
    // Add main language if available
    if (language) {
        const langSpan = document.createElement('span');
        langSpan.textContent = language;
        projectTech.appendChild(langSpan);
    }
    
    // Add topics as tech tags
    if (topics && topics.length > 0) {
        topics.slice(0, 3).forEach(topic => {
            const topicSpan = document.createElement('span');
            topicSpan.textContent = topic;
            projectTech.appendChild(topicSpan);
        });
    }
    
    // Add star count as a tech tag if available
    if (stargazers_count > 0) {
        const starsSpan = document.createElement('span');
        starsSpan.innerHTML = `<i class="fas fa-star"></i> ${stargazers_count}`;
        projectTech.appendChild(starsSpan);
    }
    
    // Create project links
    const projectLinks = document.createElement('div');
    projectLinks.className = 'project-links';
    
    // GitHub link
    const githubLink = document.createElement('a');
    githubLink.href = html_url;
    githubLink.target = '_blank';
    githubLink.className = 'btn small-btn';
    githubLink.innerHTML = '<i class="fab fa-github"></i> Source Code';
    projectLinks.appendChild(githubLink);
    
    // Live demo link if homepage is available
    if (homepage) {
        const demoLink = document.createElement('a');
        demoLink.href = homepage;
        demoLink.target = '_blank';
        demoLink.className = 'btn small-btn';
        demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
        projectLinks.appendChild(demoLink);
    }
    
    // Assemble project info
    projectInfo.appendChild(projectTitle);
    projectInfo.appendChild(projectDesc);
    projectInfo.appendChild(projectTech);
    projectInfo.appendChild(projectLinks);
    
    // Assemble project card
    projectCard.innerHTML = carouselHTML;
    projectCard.appendChild(projectInfo);
    
    // Add to container
    container.appendChild(projectCard);
    
    // Fetch repository contents to look for images
    fetch(`https://api.github.com/repos/${repo.full_name}/contents`)
        .then(response => response.json())
        .then(contents => {
            // Look for images in the repository
            const imageFiles = contents.filter(file => 
                file.type === 'file' && 
                /\.(jpg|jpeg|png|gif|svg)$/i.test(file.name)
            );
            
            if (imageFiles.length > 0) {
                // Get the carousel inner element
                const carouselInner = projectCard.querySelector('.carousel-inner');
                carouselInner.innerHTML = ''; // Clear default image
                
                // Add up to 3 images to the carousel
                imageFiles.slice(0, 3).forEach((image, index) => {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                    
                    const img = document.createElement('img');
                    img.src = image.download_url;
                    img.alt = `${name} - ${image.name}`;
                    
                    carouselItem.appendChild(img);
                    carouselInner.appendChild(carouselItem);
                });
                
                // If there are multiple images, add carousel controls
                if (imageFiles.length > 1) {
                    const carousel = projectCard.querySelector('.carousel');
                    
                    const prevButton = document.createElement('button');
                    prevButton.className = 'carousel-control prev';
                    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    
                    const nextButton = document.createElement('button');
                    nextButton.className = 'carousel-control next';
                    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    
                    carousel.appendChild(prevButton);
                    carousel.appendChild(nextButton);
                    
                    // Connect carousel controls to the existing carousel functionality
                    // This relies on the carousel functionality in your script.js
                }
            }
        })
        .catch(error => {
            console.error(`Error fetching images for ${name}:`, error);
        });
}

/**
 * Format repository name for display
 * @param {string} name - Repository name
 * @returns {string} Formatted name
 */
function formatRepoName(name) {
    // Replace hyphens and underscores with spaces
    let formattedName = name.replace(/[-_]/g, ' ');
    
    // Capitalize each word
    formattedName = formattedName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    return formattedName;
}

/**
 * Get an appropriate image URL based on the programming language
 * @param {string} language - Programming language
 * @returns {string} URL to a placeholder image
 */
function getLanguageImage(language) {
    // Use placeholder images with colors based on language
    const languageColors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#007acc',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Rust': '#dea584',
        'Dart': '#00B4AB'
    };
    
    const color = languageColors[language] || '#4a6cf7'; // Default to primary color
    
    // Return a placeholder image URL with the appropriate color
    return `/api/placeholder/800/450?text=${language || 'Repository'}&bgcolor=${color.replace('#', '')}`;
}

// Add styles for loading indicator
const style = document.createElement('style');
style.textContent = `
    .loading-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        width: 100%;
        color: white;
    }
    
    .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .error-message, .no-projects {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        color: white;
    }
`;

document.head.appendChild(style);