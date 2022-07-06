set :stage, :production
set :branch, 'develop'
set :deploy_to, '/var/www/html/ffars/client'

role :app, %w[172.16.18.43 172.16.18.44], user: 'deploy'
role :web, %w[172.16.18.43 172.16.18.44], user: 'deploy'

server '172.16.18.43',
  user: 'deploy',
  roles: %w[web app],
  ssh_options: { forward_agent: true, user: fetch(:user), keys: %w(~/.ssh/id_rsa) }
