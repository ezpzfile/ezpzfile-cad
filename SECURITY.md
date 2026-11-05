# Security

Please report security problems privately to **hello@ezpzfile.com** (English, Korean or Japanese).
Include the version, what happens, and a sample file if you can. We reply within a few days, keep the
report private until a fix is released, and credit you in the release notes if you wish.

Every engine treats its input as untrusted: sizes and counts read from a file are checked against what
the file holds, and a file that claims more fails with the error code `too-large`. Open files from
unknown sources in a Web Worker (browsers) or a worker thread (Node) so a slow file cannot block the page.
