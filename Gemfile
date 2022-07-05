source 'https://rubygems.org'
git_source(:github) do | repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github/#{repo_name}.git"
end

group :development do
  gem 'capistrano'
  gem 'capistrano-nvm', require: false
  gem 'capistrano-yarn'
end
