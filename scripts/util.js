/* eslint no-console: 0, no-cond-assign: 0 */

const fs = require("fs-extra")
const path = require("path")
const chalk = require("chalk")

const QUESTIONS_PATH = "./questions"

const TAG_NAMES = {
  javascript: "JavaScript",
  css: "CSS",
  html: "HTML",
  node: "Node"
}

const attempt = (task, cb) => {
  try {
    return cb()
  } catch (e) {
    console.log(`${chalk.red("ERROR!")} During ${task}: ${e}`)
    process.exit(1)
    return null
  }
}

const readQuestions = () =>
  attempt("read questions", () =>
    fs
      .readdirSync(QUESTIONS_PATH)
      .filter(f => !f.includes("eslint"))
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
      .reduce((acc, name) => {
        acc[name] = fs
          .readFileSync(path.join(QUESTIONS_PATH, name), "utf8")
          .replace(/\r\n/g, "\n")
        return acc
      }, {})
  )

const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join("-")

const capitalize = ([ first, ...rest ], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join("").toLowerCase() : rest.join(""))

const getCodeBlocks = str => {
  const regex = /```[.\S\s]*?```/g
  const results = []
  let m = null
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex += 1
    }
    // eslint-disable-next-line no-unused-vars
    m.forEach((match, groupIndex) => {
      results.push(match)
    })
  }
  return results
}

const getAnchor = val =>
  toKebabCase(
    val
      .replace("()", "")
      .toLowerCase()
      .replace("`", "")
  )

module.exports = {
  attempt,
  readQuestions,
  getAnchor,
  capitalize,
  getCodeBlocks,
  QUESTIONS_PATH,
  TAG_NAMES
}
