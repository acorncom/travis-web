import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import currentRepoTab from 'travis/tests/pages/repo-tabs/current';

moduleForAcceptance('Acceptance | builds/current tab', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('renders most recent repository without builds', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  let repoId = parseInt(repo.id);

  server.create('permissions', {
    admin: [repoId],
    push: [repoId],
    pull: [repoId],
    permissions: [repoId],
  });

  currentRepoTab
    .visit();

  andThen(function() {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
    assert.equal(currentRepoTab.showsNoBuildsMessaging, 'No builds for this repository', 'Current tab shows no builds message');
  });
});

QUnit.only('renders most recent repository and most recent build when builds present', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  let branch = server.create('branch', {});
  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let build = server.create('build', {number: '5', repository: repo, state: 'passed', commit_id: commit.id});
  let job = server.create('job', {number: '1234.1', repository: repo, state: 'passed', build_id: build.id, commit_id: commit.id});
  let log = server.create('log', { id: job.id });
  let repoId = parseInt(repo.id);

  server.create('permissions', {
    admin: [repoId],
    push: [repoId],
    pull: [repoId],
    permissions: [repoId],
  });

  currentRepoTab
    .visit();

  andThen(function() {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
    // assert.equal(currentRepoTab.showsNoBuildsMessaging, 'No builds for this repository', 'Current tab shows no builds message');
  });
});
