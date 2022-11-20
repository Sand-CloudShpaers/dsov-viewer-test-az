<?xml version="1.0"?>

<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:se="http://www.opengis.net/se"
                exclude-result-prefixes="se">
    <xsl:strip-space elements="*"/>

    <xsl:output method="text"/>

    <xsl:param name="type" select="type"/>

    <xsl:template match="/">
        <xsl:text>// Opmerking: Deze file is gegenereerd.
        </xsl:text>
        <xsl:text>// Zie: src/generation/README.md
        </xsl:text>
        <xsl:text>// Pas deze file niet handmatig aan.
        </xsl:text>
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:apply-templates select="@*|node()"/>
    </xsl:template>

    <xsl:template match="se:Rule/se:Name">
        <xsl:text>.symboolcode[data-symboolcode='</xsl:text><xsl:value-of select="."/><xsl:text>'] {
        background-image: url('./symbols/</xsl:text><xsl:value-of select="$type"/><xsl:text>/</xsl:text><xsl:value-of select="."/><xsl:text>.svg');
        }
        </xsl:text>
    </xsl:template>

</xsl:stylesheet>
