<?xml version="1.0"?>

<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:se="http://www.opengis.net/se"
                exclude-result-prefixes="se">
    <xsl:strip-space elements="*"/>

    <xsl:output method="html"/>

    <xsl:param name="type" select="type"/>

    <xsl:template match="/">
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
            </head>
            <body>
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="se:FeatureTypeStyle">
        <div>
            <xsl:apply-templates select="se:Description"/>
            <table>
                <tr>
                    <xsl:apply-templates/>
                </tr>
            </table>
        </div>
    </xsl:template>

    <xsl:template match="se:Description[parent::se:NamedLayer]">
        <h1>
            <xsl:apply-templates/>
        </h1>
    </xsl:template>
    <xsl:template match="se:Description[parent::se:UserStyle]">
        <h2>
            <xsl:apply-templates/>
        </h2>
    </xsl:template>
    <xsl:template match="se:Description[parent::se:FeatureTypeStyle]">
        <h3>
            <xsl:apply-templates/>
        </h3>
    </xsl:template>

    <xsl:template match="se:Rule">
        <xsl:variable name="symbolName" select="se:Name"/>
        <td>
            <table>
                <tr>
                    <td>
                        <xsl:value-of select="$symbolName"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img>
                            <xsl:attribute name="src">
                                <xsl:value-of select="concat('../../../assets/symbolen/symbols/',$type,'/',$symbolName,'.svg')"/>
                            </xsl:attribute>
                        </img>
                    </td>
                </tr>
            </table>
        </td>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:apply-templates select="@*|node()"/>
    </xsl:template>

</xsl:stylesheet>
