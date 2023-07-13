import { getEnvironment } from './getEnvironment'

/**
 * Check if the process is running in a CI environment.
 *
 * @returns `true` if process is running in a CI environment
 */
export const isCi = () => {
  const environment = getEnvironment()
  return environment.CI !== undefined
  || environment.APPVEYOR !== undefined
  || environment.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI !== undefined
  || environment.AC_APPCIRCLE !== undefined
  || environment.bamboo_planKey !== undefined
  || environment.BITBUCKET_COMMIT !== undefined
  || environment.BITRISE_IO !== undefined
  || environment.BUDDY_WORKSPACE_ID !== undefined
  || environment.BUILDKITE !== undefined
  || environment.CIRCLECI !== undefined
  || environment.CIRRUS_CI !== undefined
  || environment.CODEBUILD_BUILD_ARN !== undefined
  || environment.CF_BUILD_ID !== undefined
  || environment.CI_NAME !== undefined
  || environment.DRONE !== undefined
  || environment.DSARI !== undefined
  || environment.EAS_BUILD !== undefined
  || environment.GITHUB_ACTIONS !== undefined
  || environment.GITLAB_CI !== undefined
  || environment.GO_PIPELINE_LABEL !== undefined
  || environment.LAYERCI !== undefined
  || environment.HUDSON_URL !== undefined
  || environment.JENKINS_URL !== undefined
  || environment.MAGNUM !== undefined
  || environment.NETLIFY !== undefined
  || environment.NEVERCODE !== undefined
  || environment.RENDER !== undefined
  || environment.SAILCI !== undefined
  || environment.SEMAPHORE !== undefined
  || environment.SCREWDRIVER !== undefined
  || environment.SHIPPABLE !== undefined
  || environment.TDDIUM !== undefined
  || environment.STRIDER !== undefined
  || environment.TASK_ID !== undefined
  || environment.TEAMCITY_VERSION !== undefined
  || environment.TRAVIS !== undefined
  || environment.NOW_BUILDER !== undefined
  || environment.APPCENTER_BUILD_ID !== undefined
}
