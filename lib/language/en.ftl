ask-what-park-1 = What park are you interested in?
ask-what-park-2 = Sure! What park do you have in mind?
tell-park-crowd-is-0-level = { $park_name } is definitely a ghost town! { RELTIME($last_update, true) }, the average wait time was only { DURATION($avg_wait_mins) }.
tell-park-crowd-is-1-level = { $park_name } is definitely level 1! { RELTIME($last_update, true) }, the average wait time was { DURATION($avg_wait_mins) }.
tell-park-crowd-is-2-level = { $park_name } is definitely level 2! { RELTIME($last_update, true) }, the average wait time was { DURATION($avg_wait_mins) }.
tell-park-crowd-is-3-level = { $park_name } is definitely level 3! { RELTIME($last_update, true) }, the average wait time was { DURATION($avg_wait_mins) }.
tell-park-crowd-is-unknown = Unfortunately, I don't know enough about { $park_name }.
tell-park-is-closed = { $park_name } is closed right now, but I'm not sure when it's going to reopen.
tell-park-is-closed-and-will-reopen = { $park_name } is closed right now, and it will reopen { RELTIME($opening_time) }.
tell-park-is-open = { $park_name } is open right now, but it will close { RELTIME($closing_time) } and reopen { RELTIME($opening_time) }.