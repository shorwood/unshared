/* eslint-disable @typescript-eslint/consistent-type-imports */
import { requireSafe } from '../misc/requireSafe'
import { isBrowser, isNode } from './runtime'
import { environment } from './getVariable'

/** Is process running in Windows. */
export const isWindows = isBrowser
  ? /win/i.test(window.navigator.userAgent)
  : process.platform === 'win32'

/** Is process running in MacOS. */
export const isDarwin = isBrowser
  ? /ios|ipad|iphone|ipod|mac/i.test(window.navigator.userAgent)
  : process.platform === 'darwin'

/** Is process running in Linux. */
export const isLinux = isBrowser
  ? !isWindows && !isDarwin
  : process.platform === 'linux'

/** Is process running in a WSL environment. */
export const isWSL = isNode
  && environment.WSL_DISTRO_NAME !== undefined
  && environment.WSL_DISTRO_NAME !== 'unknown'
  && requireSafe('node:fs').existsSync('/proc/version')
  && /wsl/i.test(requireSafe('node:fs').readFileSync('/proc/version', 'utf8'))

/** Is process running in a Docker container. */
export const isDocker = isNode
  && requireSafe('node:fs').existsSync('/proc/self/cgroup')
  && /docker/i.test(requireSafe('node:fs').readFileSync('/proc/self/cgroup', 'utf8'))

/** Is process running in Kubernetes */
export const isKubernetes = isNode
  && environment.KUBERNETES_SERVICE_HOST !== undefined
  && requireSafe('node:fs').existsSync('/proc/self/cgroup')
  && /kubernetes/i.test(requireSafe('node:fs').readFileSync('/proc/self/cgroup', 'utf8'))

/** Is process running in AWS */
export const isAWS = isNode
  && requireSafe('node:fs')?.existsSync('/etc/aws_profile')

/** Is process running in Azure */
export const isAzure = isNode
  && requireSafe('node:fs')?.existsSync('/etc/azure.conf')

/** Is process running in GCP */
export const isGCP = isNode
  && requireSafe('node:fs')?.existsSync('/etc/gcp_conf')

/** Is process running in a Minikube environment. */
export const isMinikube = isNode
  && requireSafe('node:fs')?.existsSync('/etc/kubernetes/minikube')

export const isCi = isNode && (
  environment.CI !== undefined
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
)
