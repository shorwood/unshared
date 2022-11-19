import { expect, it } from 'vitest'
import { parseUri } from './parseUri'

it.each([

  ['https://user:pass@eu3.www.example.co.uk:443/path/to/file.html?query=string#hash', {
    protocol: 'https',
    authority: 'user:pass@eu3.www.example.co.uk:443',
    origin: 'https://eu3.www.example.co.uk',
    userinfo: 'user:pass',
    username: 'user',
    password: 'pass',
    host: 'eu3.www.example.co.uk:443',
    hostName: 'eu3.www.example.co.uk',
    hostPort: '443',
    hostPortNumber: 443,
    domain: 'example',
    domainRoot: 'example.co.uk',
    domainSub: 'eu3.www',
    domainTop: 'co.uk',
    domainFull: 'eu3.www.example.co.uk',
    path: '/path/to/file.html',
    pathName: 'file.html',
    pathExtension: 'html',
    pathDirectory: '/path/to',
    query: '?query=string',
    hash: '#hash',
  }],

  ['www.example.com', {
    authority: 'www.example.com',
    origin: 'www.example.com',
    host: 'www.example.com',
    hostName: 'www.example.com',
    domain: 'example',
    domainRoot: 'example.com',
    domainSub: 'www',
    domainTop: 'com',
    domainFull: 'www.example.com',
  }],

  ['user@localhost:22', {
    authority: 'user@localhost:22',
    origin: 'localhost',
    userinfo: 'user',
    username: 'user',
    host: 'localhost:22',
    hostName: 'localhost',
    hostPort: '22',
    hostPortNumber: 22,
  }],

  ['ssh://user:password@127.0.0.1:8080', {
    protocol: 'ssh',
    authority: 'user:password@127.0.0.1:8080',
    origin: 'ssh://127.0.0.1',
    userinfo: 'user:password',
    username: 'user',
    password: 'password',
    host: '127.0.0.1:8080',
    hostName: '127.0.0.1',
    hostPort: '8080',
    hostPortNumber: 8080,
    hostIp: '127.0.0.1',
    hostIpv4: '127.0.0.1',
  }],

  ['::1', {
    authority: '::1',
    host: '::1',
  }],

  ['https://[::1]:8080?q=1#hash', {
    protocol: 'https',
    authority: '[::1]:8080',
    origin: 'https://[::1]',
    host: '[::1]:8080',
    hostName: '[::1]',
    hostPort: '8080',
    hostPortNumber: 8080,
    hostIpv6: '::1',
    query: '?q=1',
    hash: '#hash',
  }],

  ['//', {
    path: '//',
    pathName: '//',
  }],

  ['//:', {
    path: '//:',
    pathName: ':',
    pathDirectory: '/',
  }],

  ['//@', {
    path: '//@',
    pathName: '@',
    pathDirectory: '/',
  }],

  ['http://', {
    protocol: 'http',
    origin: 'http',
  }],

  ['-', {
    authority: '-',
    origin: '-',
    host: '-',
    hostName: '-',
  }],

])('should extract the components of %s', (url, expected: any) => {
  const result = parseUri(url)
  console.log(url, result)
  expect(result).toEqual(expected)
})
