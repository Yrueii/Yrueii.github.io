import "transpiler-datas" as $datas;

(" "*24) as $indent

| $datas
| map({
  html_url,
  name: .short_name | @html,
  description: .description | @html,
  owner: .owner.login,
  updated_at,
  stars: .stargazers_count,
})
| sort_by(-.stars)[]
| [
  "<li style=\"font-size: larger;\"><a href=\"\(.html_url)\"><b>\(.name)</b></a> :</li>",
  "\(.description)",
  "<ul>",
  "    <li>Repo Owner : \(.owner)</li>",
  "    <li>Last Updated : \(.updated_at)</li>",
  "    <li>Stars : \(.stars)</li>",
  "</ul>",
  "<br>"
]
| map($indent+.)
| join("\n")
