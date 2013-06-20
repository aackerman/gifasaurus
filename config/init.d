#! /bin/sh
### BEGIN INIT INFO
# Provides:   gifasaurus
# Required-Start: $remote_fs $syslog
# Required-Stop:  $remote_fs $syslog
# Default-Start:  2 3 4 5
# Default-Stop:   1
# Short-Description: gifasaurus
### END INIT INFO

EXEC=/usr/local/bin/beanstalkd
PIDFILE=/var/run/gifasaurus.pid
OPTS=

set -e
. /lib/lsb/init-functions
test -x $EXEC || exit 0
export PATH="${PATH:+$PATH:}/usr/sbin:/sbin"

case "$1" in
  start)
  log_daemon_msg "Starting gifasaurus" "gifasaurus"

  if start-stop-daemon --start --quiet --oknodo --make-pidfile --background --pidfile $PIDFILE --exec $EXEC -- $OPTS; then
      log_end_msg 0
  else
      log_end_msg 1
  fi
  ;;

  stop)
  log_daemon_msg "Stopping gifasaurus" "gifasaurus"

  if start-stop-daemon --stop --quiet --oknodo --pidfile $PIDFILE; then
      log_end_msg 0
  else
      log_end_msg 1
  fi
  ;;

  restart)
  log_daemon_msg "Restarting gifasaurus" "gifasaurus"
  start-stop-daemon --stop --quiet --oknodo --retry 30 --pidfile $PIDFILE

  if start-stop-daemon --start --quiet --oknodo --make-pidfile --background --pidfile $PIDFILE --exec $EXEC -- $OPTS; then
      log_end_msg 0
  else
      log_end_msg 1
  fi
  ;;

  status)
        status_of_proc -p $PIDFILE $EXEC gifasaurus && exit 0 || exit $?
        ;;
  *)
        log_action_msg "Usage: /etc/init.d/gifasaurus {start|stop|restart}"
        exit 1
esac

exit 0
