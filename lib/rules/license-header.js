'use strict';

const year = new Date().getUTCFullYear();

const message = `* Copyright (c) ${year} Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 `;

const comment = `/*${message}*/`;

module.exports = context => ({
  Program: node => {
    const leadingComments = getLeadingComments(context, node).filter(
      comment => comment.type !== 'Shebang'
    );

    if (!leadingComments.length) {
      context.report({
        loc: node.loc,
        message: 'missing license header',
        fix: fixer => fixer.insertTextBefore(node, comment),
      });
    } else {
      const {type, value} = leadingComments[0];
      if (type !== 'Block' || value !== message) {
        context.report({
          loc: node.loc,
          message: 'header should exactly match license',
        });
      }
    }
  },
});

function getLeadingComments(context, node) {
  return node.body.length
    ? context.getComments(node.body[0]).leading
    : context.getComments(node).leading;
}
