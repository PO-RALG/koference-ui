desc 'Open ssh "cap [staging] ssh [server_index default: 0]"'
task :ssh do
 on roles(:app) do |server|
   server_index = ARGV[2].to_i
   return if server != roles(:app)[server_index]
   puts "Opening SSH Console on : #{host}...."
   cmd = "ssh #{server.user}@#{host}"
   puts cmd
   exec cmd
 end
end
