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
    <h3>Loading My Latest Projects</h3>
    <p>Fetching data from GitHub...</p>
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch repository contents');
        }
        return response.json();
    })
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
                img.onerror = () => {
                    // If image fails to load, replace with fallback
                    createFallbackImage(projectCard, name, language);
                };
                
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
            }
        } else {
            // Use fallback if no images found
            createFallbackImage(projectCard, name, language);
        }
    })
    .catch(error => {
        console.error(`Error fetching images for ${name}:`, error);
        // Use fallback on error
        createFallbackImage(projectCard, name, language);
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
    // Map languages to their corresponding icon URLs
    const languageIcons = {
        'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
        'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
        'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
        'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
        'Ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
        'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
        'Swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
        'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
        'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
        'Dart': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
        'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'
    };
    
    // Use the corresponding icon URL, otherwise use a generic code icon
    return languageIcons[language] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg';
} 


// Create a visually appealing fallback for projects without images
function createFallbackImage(projectCard, name, language) {
    const carouselInner = projectCard.querySelector('.carousel-inner');
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'project-fallback-image';
    
    // Use language to determine background color
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
    
    const bgColor = languageColors[language] || '#4a6cf7';
    
    // Create a div with icon and text
    fallbackDiv.innerHTML = `
        <div class="fallback-content" style="background-color: ${bgColor}">
            <i class="fas fa-code fa-3x"></i>
            <h4>${formatRepoName(name)}</h4>
            <p>${language || 'Code'} Project</p>
        </div>
    `;
    
    carouselInner.innerHTML = '';
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item active';
    carouselItem.appendChild(fallbackDiv);
    carouselInner.appendChild(carouselItem);
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