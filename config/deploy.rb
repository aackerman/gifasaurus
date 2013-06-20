default_run_options[:pty] = true

set :application, "gifasaur.us"
set :repository,  "git@github.com:aackerman/gifasaur.us.git"
set :scm, :git
set :deploy_to, "/var/www/gifasaur.us"
set :user, "aackerman"
set :owner, "aackerman"
set :group, "aackerman"
set :branch, "master"
set :executable, "gifasaurus"
set :use_sudo, false
set :ssh_options, { :forward_agent => true }
set :deploy_via, :remote_cache

set :default_environment, {
  'GOROOT' => "/usr/local/go",
  'GOPATH' => "/home/aackerman/go",
}

role :app, "gifasaur.us"

after "deploy:restart", "deploy:cleanup"

namespace :deploy do
  task :start do

  end

  task :stop do

  end

  task :restart do
    stop
    start
  end

  desc "Deploy the app"
  task :default do
    update
    restart
  end

  desc "Setup and clone the repo."
  task :setup do
    run "git clone #{repository} #{deploy_to}"
  end

  desc "Update the deployed code"
  task :update do
    run "cd #{deploy_to} && git pull origin #{branch}"
  end
end
