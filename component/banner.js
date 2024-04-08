const bannerConfig = {
  logo: 'conjure-cp',
  title: "Permutation Pattern",
  author: "Sophia Ho",
  author_github: "https://github.com/shmy1",
  description: "",
  repo_url: 'conjure-cp/permutation-patterns-demo',
  github: "https://github.com/conjure-cp/permutation-patterns-demo",
  license: 'Mozilla Public License 2.0'
};

document.addEventListener('DOMContentLoaded', () => {
  // Populate banner with config data
  const logoElement = document.querySelector('.banner-logo-link');
  logoElement.href = bannerConfig.github; // Assuming the logo should link to the GitHub repository
  logoElement.textContent = bannerConfig.logo;

  const titleElement = document.querySelector('.banner-title');
  titleElement.textContent = bannerConfig.title;

  const descriptionElement = document.querySelector('.banner-description');
  descriptionElement.textContent = bannerConfig.description;

  const licenseElement = document.querySelector('.banner-license');
  licenseElement.textContent = `License: ${bannerConfig.license}`;

  // Populate Project Author
  const authorLink = document.querySelector('.banner-author-link');
  authorLink.href = bannerConfig.author_github;
  authorLink.textContent = bannerConfig.author;

  const githubLinks = document.querySelectorAll('.banner-github-link, .banner-github-readme-link, .banner-github-preview-link');
  githubLinks.forEach(link => {
    if (link.classList.contains('banner-github-link')) {
      link.href = bannerConfig.github;
    } else if (link.classList.contains('banner-github-readme-link')) {
      link.href = `${bannerConfig.github}#readme`;
    } else if (link.classList.contains('banner-github-preview-link')) {
      link.href = `${bannerConfig.github}#application-preview`;
    }
  });

  // Fetch contributors from GitHub
  fetch(`https://api.github.com/repos/${bannerConfig.repo_url}/contributors`)
    .then(response => response.json())
    .then(data => {
      const contributorsElement = document.getElementById('contributors');
      contributorsElement.innerHTML = data
        .filter(contributor => contributor.login !== 'williamburns' && !contributor.login.endsWith('[bot]'))
        .map(contributor => `<a href="https://github.com/${contributor.login}" class="mb-1 text-black hover:underline hover:text-stone-700 pr-4">${contributor.login}</a>`)
        .join('');
    })
    .catch(error => console.error('Error:', error));
});
